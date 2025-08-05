import { AppDataSource } from "../data-source";
import { Skill } from "../entity/Skill";

export class SkillService {
    private skillRepository = AppDataSource.getRepository(Skill);

    async getAllSkills(): Promise<Skill[]> {
        return await this.skillRepository.find();
    }

    async getSkillById(id: number): Promise<Skill | null> {
        const skill = await this.skillRepository.findOne({
            where: { id },
        });

        if (!skill) {
            console.error(`Skill with ID ${id} not found`);
        }

        return skill;
    }

    async createSkillWithTransaction(name: string, queryRunner: any): Promise<Skill> {
        const skill = await queryRunner.manager.findOne(Skill, {
            where: { name }
        });

        if (skill) {
            return skill;
        }

        const newSkill = new Skill();
        newSkill.name = name;
        return await queryRunner.manager.save(Skill, newSkill);
    }
    
    async getSkillByName(name: string): Promise<Skill | null> {
        const skill = await this.skillRepository.findOne({
            where: { name },
        });

        if (!skill) {
            console.error(`Skill with name ${name} not found`);
        }

        return skill;
    }
}
