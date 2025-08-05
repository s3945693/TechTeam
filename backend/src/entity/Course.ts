import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, AfterLoad } from 'typeorm';
import { User } from './User';
import { Application } from './Applications';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: ["Tutorial", "Lab"]
    })
    session_type: 'Tutorial' | 'Lab';

    @Column({ nullable: false, unique: true })
    internal_course_id: string;

    @ManyToOne(() => User, (user) => user.courses, { nullable: true })
    @JoinColumn({ name: "assigned_lecturer_id" })
    assignedLecturer: User | null;

    @OneToMany(() => Application, (application) => application.course)
    applications: Application[];

}