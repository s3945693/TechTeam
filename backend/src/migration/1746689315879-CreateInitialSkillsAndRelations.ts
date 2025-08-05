import { MigrationInterface, QueryRunner } from "typeorm";
import { Skill } from "../entity/Skill";
import { User } from "../entity/User";
import { UserSkills } from "../entity/UserSkills";

export class CreateInitialSkillsAndRelations1746689315879 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, create the skills
        const skills = [
            { name: "Math" },
            { name: "Science" }
        ];

        const createdSkills = await queryRunner.manager.save(Skill, skills);

        // Get all candidates (users with role "Candidate")
        const candidates = await queryRunner.manager.find(User, {
            where: { role: "Candidate" }
        });

        // Create UserSkills entries for each candidate-skill combination
        const userSkillsEntries: UserSkills[] = [];
        
        for (const candidate of candidates) {
            for (const skill of createdSkills) {
                const userSkill = new UserSkills();
                userSkill.user_id = candidate.id;
                userSkill.skill_id = skill.id;
                userSkillsEntries.push(userSkill);
            }
        }

        // Save all UserSkills entries
        await queryRunner.manager.save(UserSkills, userSkillsEntries);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove all user skills relationships
        await queryRunner.manager.delete(UserSkills, {});
        
        // Remove all skills
        await queryRunner.manager.delete(Skill, {});
    }
} 