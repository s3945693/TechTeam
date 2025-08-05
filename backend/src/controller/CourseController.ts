import { CourseService } from "../services/CourseService";
import { Course } from "../entity/Course";
import { Request, Response } from "express";

export class CourseController {
    private service = new CourseService();
    
    async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const courses: Course[] = await this.service.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving courses", error });
        }
    }

    async getAllCoursesForLecturer(req: Request, res: Response): Promise<void> {
        const lecturerId = parseInt(req.params.id);
        try {
            const courses: Course[] = await this.service.getAllCoursesForLecturer(lecturerId);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving courses for lecturer", error });
        }
    }

    async getUnappliedCoursesForCandidate(req: Request, res: Response): Promise<void> {
        const candidateId = parseInt(req.params.id);
        try {
            const courses: Course[] = await this.service.getUnappliedCoursesForCandidate(candidateId);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving unapplied courses for candidate", error });
        }
    }

    async getApplieedCourseIdsForCandidate(req: Request, res: Response): Promise<void> {
        const candidateId = parseInt(req.params.id);
        try {
            const courses: Course[] = await this.service.getAppliedCoursesForCandidate(candidateId);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving applied courses for candidate", error });
        }
    }

    async getAppliedCourseIdsForCandidate(req: Request, res: Response): Promise<void> {
        const candidateId = parseInt(req.params.id);
        try {
            const courseIds: number[] = await this.service.getAppliedCourseIdsForCandidate(candidateId);
            res.status(200).json(courseIds);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving applied course IDs for candidate", error });
        }
    }

    async getCourseById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        try {
            const course: Course | null = await this.service.getCourseById(id);
            if (!course) {
                res.status(404).json({ message: "Course not found" });
            } else {
                res.status(200).json(course);
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving course", error });
        }
    }

    async filterCourses(req: Request, res: Response): Promise<void> {
        const { role, userId, internalCourseId, courseName } = req.query;

        try {
            const filteredCourses = await this.service.filterCourses(
                userId as string,
                role as string,
                internalCourseId as string,
                courseName as string
            );
            res.status(200).json(filteredCourses);
        } catch (error) {
            res.status(500).json({ message: "Error filtering courses", error });
        }
    }

}