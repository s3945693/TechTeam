import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Skill } from "./Skill";

@Entity("user_skills") // Explicitly name the table
export class UserSkills {
    @PrimaryColumn()
    user_id: number;
    
    @PrimaryColumn()
    skill_id: number;
    
    @ManyToOne(() => User, (user) => user.userSkills, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: User;
    
    @ManyToOne(() => Skill, (skill) => skill.userSkills, { 
        onDelete: 'CASCADE',
        eager: true // This will automatically load the skill data
    })
    @JoinColumn({ name: "skill_id" })
    skill: Skill;
}