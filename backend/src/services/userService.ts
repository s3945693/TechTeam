//login, signup and user information, candidate course application handling
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { SkillService } from "./SkillService";
import { UserSkillService } from "./UserSkillService";
import { UserSkills } from "../entity/UserSkills";

export class UserService {
    
    private userRepository = AppDataSource.getRepository(User);

    async login(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            return null;
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async getUserByIdWithSkills(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id }, relations: ["userSkills"] });
    }

    async updateUserFromApplication(userId: any, args: { academic_credentials: any; skills: any; previous_roles: any; }) {
        // Start a transaction
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(User, { 
                where: { id: userId },
                relations: ["userSkills"]
            });

            if (!user) {
                throw new Error("User not found");
            }
            
            // Update user properties
            if (args.academic_credentials) {
                user.academic_credentials = args.academic_credentials;
            }   
            if (args.previous_roles) {
                user.previous_roles = args.previous_roles;
            }

            // Save user changes
            await queryRunner.manager.save(user);

            // Handle skills separately
            if (args.skills) {
                // Remove existing skills
                await queryRunner.manager
                    .createQueryBuilder()
                    .delete()
                    .from(UserSkills)
                    .where("user_id = :userId", { userId })
                    .execute();
                
                // Add new skills
                const skillService = new SkillService();
                for (const skillName of args.skills) {
                    const skill = await skillService.createSkillWithTransaction(skillName, queryRunner);
                    await queryRunner.manager.save(UserSkills, {
                        user_id: userId,
                        skill_id: skill.id
                    });
                }
            }

            // Commit the transaction
            await queryRunner.commitTransaction();

            // Return updated user
            return await this.getUserByIdWithSkills(userId);
        } catch (error) {
            // Rollback the transaction in case of error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }
}