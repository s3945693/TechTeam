import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateSkillTable1746689315878 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create new skills table
        await queryRunner.createTable(
            new Table({
                name: "skill",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isUnique: true,
                    },
                ],
            }),
            true
        );

        // Create user_skills junction table
        await queryRunner.createTable(
            new Table({
                name: "user_skills",
                columns: [
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "skill_id",
                        type: "int",
                    },
                ],
            }),
            true
        );

        // Add foreign keys to user_skills table
        await queryRunner.createForeignKey(
            "user_skills",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "user_skills",
            new TableForeignKey({
                columnNames: ["skill_id"],
                referencedTableName: "skill",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the junction table and skills table
        await queryRunner.dropTable("user_skills");
        await queryRunner.dropTable("skill");
    }
} 