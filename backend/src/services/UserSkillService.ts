import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { UserSkills } from "../entity/UserSkills";

export class UserSkillService {
    private userSkillRepository = AppDataSource.getRepository(UserSkills);

    async getUserSkills(userId: number): Promise<UserSkills[]> {
        return this.userSkillRepository.find({ where: { user_id: userId } });
    }

    async getUsersWithSkill(skillId: number): Promise<User[]> {
        return AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .innerJoin("user.userSkills", "userSkill")
            .where("userSkill.skill_id = :skillId", { skillId })
            .getMany();
    }

    async addUserSkill(userId: number, skillId: number): Promise<UserSkills> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userSkill = await queryRunner.manager.save(UserSkills, {
                user_id: userId,
                skill_id: skillId
            });
            await queryRunner.commitTransaction();
            return userSkill;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async removeUserSkill(userId: number, skillId: number): Promise<void> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(UserSkills, {
                user_id: userId,
                skill_id: skillId
            });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async removeAllUserSkills(userId: number): Promise<void> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(UserSkills)
                .where("user_id = :userId", { userId })
                .execute();
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}