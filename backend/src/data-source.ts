import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import { User } from "./entity/User"; // import your entities
import { Course } from "./entity/Course";
import { Application } from "./entity/Applications";
import { Skill } from "./entity/Skill";
import { UserSkills } from "./entity/UserSkills";
import { configForDataSource } from "./config";

// Use path.resolve for Windows compatibility
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: configForDataSource.username,
  password: configForDataSource.password,
  database: configForDataSource.database,
  synchronize: false,
  logging: true,
  entities: [User, Course, Application, Skill, UserSkills],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});


/*

# This worked
npx typeorm migration:create src/migration/CreateUsersTable

npx typeorm migration:run -- -d src/data-source.ts

# if using the ts-node wrapper:
npm run typeorm -- migration:generate src/migration/THE_NAME_OF_THE_MIGRATION -d src/data-source.ts

# to apply a migration:
npm run typeorm -- migration:run -d src/data-source.ts

# to revert a migration:
npm run typeorm -- migration:revert -d src/data-source.ts


npx typeorm migration:create src/migration/UpdateCourseTableToIncludeLectueres

*/