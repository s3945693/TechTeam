import { Course } from "../entity/Course";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourses1746609913044 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const courses = [
            {
                name: "Math 101",
                description: "Basic Mathematics",
                internal_course_id: "COSC1000",
            },
            {
                name: "Physics 101",
                description: "Basic Physics",
                internal_course_id: "COSC1011",
            },
            {
                name: "Chemistry 101",
                description: "Basic Chemistry",
                internal_course_id: "COSC1101",
            },
        ];

        await queryRunner.manager.insert(Course, courses);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(Course, { name: "Math 101" });
        await queryRunner.manager.delete(Course, { name: "Physics 101" });
        await queryRunner.manager.delete(Course, { name: "Chemistry 101" });
    }
}
