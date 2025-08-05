import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from "typeorm";
import { Course } from "./Course";
import { Skill } from "./Skill";
import { Application } from "./Applications"; // Import Application entity
import { UserSkills } from "./UserSkills";
import * as bcrypt from "bcrypt";
import { omit } from "lodash";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: ["Admin", "Candidate", "Lecturer"],
  })
  role: "Admin" | "Candidate" | "Lecturer";

  @OneToMany(() => UserSkills, userSkills => userSkills.user)
  userSkills: UserSkills[];

  @Column("simple-array", { nullable: true })
  previous_roles: string[];

  @Column("simple-array", { nullable: true })
  academic_credentials: string[];

  @Column({ default: 'Active', nullable: false, type: 'enum', enum: ['Active', 'Inactive'] })
  account_status: "Active" | "Inactive";

  @OneToMany(() => Course, (course) => course.assignedLecturer)
  courses: Course[];

  @OneToMany(() => Application, (application) => application.user) // Add this relation
  applications: Application[]; // List of applications associated with the user

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get acceptedApplicationsCount(): number {
    if (this.applications) {
      return this.applications.filter(app => app.status === 'Accepted').length;
    }
    return 0;
  }

  toJSON(): Partial<User> {
    const userWithoutPassword = omit(this, "password");

    if (this.role === "Lecturer") {
      return omit(userWithoutPassword, [
        "previous_roles",
        "academic_credentials",
        "userSkills",
      ]);
    }

    if (this.role === "Candidate") {
      return omit(userWithoutPassword, ["courses"]);
    }

    if (this.role === "Admin") {
      return omit(userWithoutPassword, [
        "previous_roles",
        "academic_credentials",
        "userSkills",
      ]);
    }

    return userWithoutPassword;
  }
}