import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1745909143360 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "firstName",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "lastName",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "email",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "role",
                    type: "enum",
                    enum: ["Admin", "Candidate", "Lecturer"],
                    isNullable: false
                },
                {
                    name: "previous_roles",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "academic_credentials",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "account_status",
                    type: "enum",
                    enum: ["Active", "Inactive"],
                    default: "'Active'",
                    isNullable: false
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
    }
}