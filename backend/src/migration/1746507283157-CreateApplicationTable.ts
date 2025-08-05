import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateApplicationTable1746507283157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "application",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "userId",
                        type: "int",
                    },
                    {
                        name: "courseId",
                        type: "int",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["Pending", "Accepted"],
                        default: "'Pending'",
                        isNullable: false,
                    },
                    {
                        name: "comments",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "availability",
                        type: "enum",
                        enum: ["Part Time", "Full Time"],
                        isNullable: false,
                    },
                    {
                        name: "ranking",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // Create foreign key for userId column
        await queryRunner.createForeignKey(
            "application",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // Create foreign key for courseId column
        await queryRunner.createForeignKey(
            "application",
            new TableForeignKey({
                columnNames: ["courseId"],
                referencedTableName: "course",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("application");

        if (table) {
            // Drop foreign key for userId, if exists
            const userForeignKey = table.foreignKeys.find(
                fk => fk.columnNames.indexOf("userId") !== -1
            );
            if (userForeignKey) {
                await queryRunner.dropForeignKey("application", userForeignKey);
            }
            // Drop foreign key for courseId, if exists
            const courseForeignKey = table.foreignKeys.find(
                fk => fk.columnNames.indexOf("courseId") !== -1
            );
            if (courseForeignKey) {
                await queryRunner.dropForeignKey("application", courseForeignKey);
            }
        }

        await queryRunner.dropTable("application", true);
    }
}
