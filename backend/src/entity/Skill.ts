import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserSkills } from "./UserSkills";

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => UserSkills, userSkills => userSkills.skill)
    userSkills: UserSkills[];
} 