import { ApplicationService } from "../services/ApplicationService";
import { Application } from "../entity/Applications";
import { Request, Response } from "express";
import { UserService } from "../services/UserService";


export class ApplicationController {
    private service = new ApplicationService();
    private userService = new UserService();

    async getApplicationsByCourseId(req: Request, res: Response): Promise<void> {
        const courseId = parseInt(req.params.id);
        try {
            const applications: Application[] = await this.service.getApplicationsByCourseId(courseId);
            res.status(200).json(applications);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving applications", error });
        }
    }

    async getApplicationByCandidateId(req: Request, res: Response): Promise<void> {
        const candidateId = parseInt(req.params.id);
        try {
            const applications: Application[] = await this.service.getApplicationByCandidateId(candidateId);
            res.status(200).json(applications);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving applications", error });
        }
    }

    async createApplication(req: Request, res: Response): Promise<void> {
        const { courseId, userId, availability, academic_credentials, skills, previous_roles } = req.body;
        // Validate required fields
        if (!courseId || !userId || !availability || !academic_credentials || !skills || !previous_roles) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        try {
            // Create new application
            const application = await this.service.createApplication({
                course: courseId,
                user: userId, 
                availability,
                status: "Pending",
            });

            const updatedUser = await this.userService.updateUserFromApplication(userId, {
                academic_credentials,
                skills,
                previous_roles
            });
            res.status(201).json(application);
        } catch (error) {
            console.error("Error creating application:", error);
            res.status(500).json({ message: "Error creating application", error });
        }
    }

    async getApplicationsAndUsersByCourseId(req: Request, res: Response): Promise<void> {
        const courseId = parseInt(req.params.id);
        try {
            const applications: Application[] = await this.service.getUsersByCourseId(courseId);
            res.status(200).json(applications);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving applications", error });
        }
    }

    async getFilteredAppilicationsByCourseId(req: Request, res: Response): Promise<void> {
        const courseId = parseInt(req.params.id);
        // Parse and transform query parameters to match the expected filter type
        // In your controller
        const availability = req.query.availability as string;
        const skillList = req.query.skillList as string[];
        const filter = {
            name: (req.query.name as string) || '',
            availability: availability === 'Any' ? undefined : (availability as 'Part Time' | 'Full Time'),
            skills: skillList ? skillList.map(skill => skill.toLowerCase()) : undefined,
        };
        
        try {
            const applications: Application[] = await this.service.getFilteredAppilicationsByCourseId(courseId, filter);
            res.status(200).json(applications);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving applications", error });
        }
    }

    async acceptApplication(req: Request, res: Response): Promise<void> {
        const applicationId = parseInt(req.params.id);
        try {
            const application = await this.service.acceptApplication(applicationId);
            res.status(200).json(application);
        } catch (error) {
            res.status(500).json({ message: "Error accepting application", error });
        }
    }

    async updateApplication(req: Request, res: Response): Promise<void> {
        const applicationId = parseInt(req.params.id);
        const { ranking, comments } = req.body;
        try {
            const application = await this.service.updateApplication(applicationId, { ranking, comments });
            res.status(200).json(application);
        } catch (error) {
            res.status(500).json({ message: "Error updating application", error });
        }
    }

    async getCourseApplicantSummary(req: Request, res: Response): Promise<void> {
        const courseId = parseInt(req.params.id);
        try {
            const summary = await this.service.getCourseApplicantSummary(courseId);
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving course applicant summary", error });
        }
    }

}