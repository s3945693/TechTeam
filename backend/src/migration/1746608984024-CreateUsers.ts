import { MigrationInterface, QueryRunner, In } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

export class CreateUsers1746608984024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const users: Partial<User>[] = [
            {
                firstName: "Alice",
                lastName: "",
                email: "test@example.com",
                password: "password123",
                role: "Lecturer",
                previous_roles: [],
                academic_credentials: [],
            },
            {
                firstName: "Dave",
                lastName: "",
                email: "test1@example.com",
                password: "password123",
                role: "Lecturer",
                previous_roles: [],
                academic_credentials: [],
            },
            {
                firstName: "Shaun",
                lastName: "",
                email: "test2@example.com",
                password: "password123",
                role: "Lecturer",
                previous_roles: [],
                academic_credentials: [],
            },
            {
                firstName: "Coby",
                lastName: "",
                email: "test3@example.com",
                password: "password123",
                role: "Candidate",
                previous_roles: ["Math Course", "Science Course"],
                academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
            },
            {
                firstName: "Liam",
                lastName: "",
                email: "test4@example.com",
                password: "password123",
                role: "Candidate",
                previous_roles: ["Math Course", "Science Course"],
                academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
            },
            {
                firstName: "John",
                lastName: "",
                email: "test5@example.com",
                password: "password123",
                role: "Candidate",
                previous_roles: ["Math Course", "Science Course"],
                academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
            },
            {
                firstName: "James",
                lastName: "",
                email: "test6@example.com",
                password: "password123",
                role: "Candidate",
                previous_roles: ["Math Course", "Science Course"],
                academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
            },
        ];

        for (const user of users) {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }


        await queryRunner.manager.save(User, users);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, {
            email: In([
                "test@example.com",
                "test1@example.com",
                "test2@example.com",
                "test3@example.com",
                "test4@example.com",
                "test5@example.com",
                "test6@example.com",
            ])
        });
    }
}