import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCoursesTable1746507207004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "course",
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
                    },
                    {
                        name: "description",
                        type: "varchar",
                    },
                    {
                        name: "session_type",
                        type: "enum",
                        enum: ["Tutorial", "Lab"],
                    },
                    {
                        name: "assigned_lecturer_id",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "internal_course_id",
                        type: "varchar",
                        isNullable: false,
                        default: "'N/A'",
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["assigned_lecturer_id"],
                        referencedTableName: "user",
                        referencedColumnNames: ["id"],
                        onDelete: "SET NULL",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("course", true);
    }
}