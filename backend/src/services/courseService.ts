//any function that would need to use the courses table, such as list of courses, or list of applicants for a course
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export class CourseService {
    private courseRepository = AppDataSource.getRepository(Course);

    async getAllCourses(): Promise<Course[]> {
        return await this.courseRepository.find({
            relations: ["applications", "assignedLecturer"], // Include related entities if needed
        });
    }

    async getAllCoursesWithApplications(): Promise<Course[]> {
        return await this.courseRepository.find({
            relations: ["applications"], // Include related entities if needed
        });
    }

    async getCourseById(id: number): Promise<Course | null> {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ["applications", "assignedLecturer"], // Include applications relation
        });

        if (!course) {
            throw new Error(`Course with ID ${id} not found`);
        }

        return course;
    }

    async getAllCoursesForLecturer(lecturerId: number): Promise<Course[]> {
        return await this.courseRepository.find({
            where: { assignedLecturer: { id: lecturerId } },
            relations: ["applications"],
        });
    }

    async getUnappliedCoursesForCandidate(candidateId: number): Promise<Course[]> {
        return await this.courseRepository
            .createQueryBuilder("course")
            .leftJoin("course.applications", "application")
            .where("application.userId IS NULL OR application.userId != :candidateId", { candidateId })
            .getMany();
    }

    async getAppliedCoursesForCandidate(candidateId: number): Promise<Course[]> {
        return await this.courseRepository.find({
            where: {
                applications: {
                    user: { id: candidateId },
                },
            },
        });
    }

    async getAppliedCourseIdsForCandidate(candidateId: number): Promise<number[]> {
        const courses = await this.courseRepository
            .createQueryBuilder("course")
            .select("course.id")
            .innerJoin("course.applications", "application")
            .where("application.user.id = :candidateId", { candidateId })
            .getMany();

        return courses.map(course => course.id);
    }

    async filterCourses(userId: string, role: string, internalCourseId?: string, courseName?: string): Promise<Course[]> {
        const queryBuilder = this.courseRepository.createQueryBuilder("course");

        if(role === 'Lecturer') {
            queryBuilder.where("course.assignedLecturer = :userId", { userId });
        }
    
        if (internalCourseId) {
            queryBuilder.andWhere("course.internal_course_id LIKE :internalCourseId", {
                internalCourseId: `%${internalCourseId}%`,
            });
        }
    
        if (courseName) {
            queryBuilder.andWhere("course.name LIKE :courseName", {
                courseName: `%${courseName}%`,
            });
        }
        
        queryBuilder.leftJoinAndSelect("course.applications", "applications");
    
        return await queryBuilder.getMany();
    }
}