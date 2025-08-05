import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.applications) // Add inverse relation
    user: User;

    @ManyToOne(() => Course, (course) => course.applications) // Add inverse relation
    course: Course;

    @Column({
        type: 'enum',
        enum: ['Pending', 'Accepted'],
        nullable: false,
        default: 'Pending',
    })
    status: 'Pending' | 'Accepted';

    @Column({ type: 'text', nullable: true })
    comments?: string;

    @Column({
        type: 'enum',
        enum: ['Part Time', 'Full Time'],
        nullable: false,
    })
    availability: 'Part Time' | 'Full Time';

    @Column({ nullable: true })
    ranking?: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}