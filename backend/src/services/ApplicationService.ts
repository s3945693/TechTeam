import { AppDataSource } from "../data-source";
import { Application } from "../entity/Applications";
import { UserSkills } from "../entity/UserSkills";

interface ApplicantSummary {
  [acceptedCount: number]: {
    id: number;
    firstName: string;
    lastName: string;
    applicationId: number;
  }[];
}

export class ApplicationService {
    private applicationRepository = AppDataSource.getRepository(Application);

    async getApplicationsByCourseId(courseId: number): Promise<Application[]> {
        return await this.applicationRepository.find({
            where: { course: { id: courseId } },
            relations: ["user"],
        });
    }

    async getApplicationByCandidateId(candidateId: number): Promise<Application[]> {
        return await this.applicationRepository.find({
            where: { user: { id: candidateId } },
            relations: ["course"],
        });
    }

    async createApplication(applicationData: Partial<Application>): Promise<Application> {
        // Convert string IDs to numbers if needed
        if (!applicationData.course || !applicationData.user || !applicationData.availability) {
            throw new Error('Missing required fields: course, user, or availability');
        }
        const courseId = typeof applicationData.course === 'string' ? parseInt(applicationData.course) : applicationData.course?.id;
        const userId = typeof applicationData.user === 'number' ? applicationData.user : applicationData.user?.id;
        
        // Check for existing application using IDs
        const existingApplication = await this.applicationRepository.findOne({
            where: {
                user: { id: userId },
                course: { id: courseId }
            }
        });
        
        if (existingApplication) {
            throw new Error('User has already applied to this course');
        }
        
        // Create application with properly formatted data
        const application = this.applicationRepository.create({
            ...applicationData,
            // Make sure to convert string to entity references with proper IDs
            course: { id: courseId },
            user: { id: userId }
        });
        
        return await this.applicationRepository.save(application);
    }

    async getUsersByCourseId(courseId: number): Promise<Application[]> {
        const applications = await this.applicationRepository.find({
            where: { course: { id: courseId } },
            relations: ["user", "user.userSkills", "user.userSkills.skill"]
        });
            
        return applications;
    }

    async getFilteredAppilicationsByCourseId(courseId: number, filter: {name: string, availability: 'Part Time'|'Full Time'| undefined, skills: string[] | undefined}): Promise<Application[]> {
        // Start building the query
        let query = this.applicationRepository.createQueryBuilder("application")
            .leftJoinAndSelect("application.user", "user")
            .leftJoinAndSelect("user.userSkills", "userSkill")
            .leftJoinAndSelect("userSkill.skill", "skill")
            .where("application.course.id = :courseId", { courseId });
        
        // Add name filter if provided (using firstName or lastName)
        if (filter.name && filter.name.trim() !== '') {
            query = query.andWhere(
                "(user.firstName LIKE :name OR user.lastName LIKE :name)",
                { name: `%${filter.name}%` }
            );
        }
        
        // Add availability filter if provided
        if (filter.availability && filter.availability !== undefined) {
            query = query.andWhere("application.availability = :availability", 
                { availability: filter.availability });
        }
        
        // Add skills filter if skills are provided
        if (filter.skills && filter.skills.length > 0) {
            query = query.andWhere(qb => {
                // Create subquery to find users with matching skills
                const usersWithMatchingSkillsQuery = qb
                    .subQuery()
                    .select("userSkills.user_id")
                    .from(UserSkills, "userSkills")
                    .innerJoin("userSkills.skill", "skillEntity")  // More descriptive join alias
                    .where("LOWER(skillEntity.name) IN (:...skillNames)", { 
                        skillNames: filter.skills?.map(s => s.toLowerCase()) || [] 
                    })
                    .getQuery();
                    
                // Filter users based on the subquery results
                return "user.id IN " + usersWithMatchingSkillsQuery;
            });
        }
        
        const applications = await query.getMany();
        
        return applications;
    }

    // Add this private method
    private async findApplicationById(applicationId: number): Promise<Application> {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
        });
        
        if (!application) {
            throw new Error('Application not found');
        }
        
        return application;
    }

    // Then update methods to use it
    async acceptApplication(applicationId: number): Promise<Application> {
        const application = await this.findApplicationById(applicationId);
        application.status = 'Accepted';
        return await this.applicationRepository.save(application);
    }

    async updateApplication(applicationId: number, applicationData: Partial<Application>): Promise<Application> {
        const application = await this.findApplicationById(applicationId);
        Object.assign(application, applicationData);
        return await this.applicationRepository.save(application);
    }

    async getCourseApplicantSummary(courseId: number): Promise<any> {
        // Load applications with users and their applications (for the acceptedApplicationsCount getter)
        const applicationsForCourse = await this.applicationRepository.find({
            where: { course: { id: courseId } },
            relations: ["user", "user.applications"],
        });

        // Initialize summary object
        const applicationSummary: ApplicantSummary = {};

        for (const application of applicationsForCourse) {
            if (application.user) {
                // Get the count of accepted applications
                const acceptedCount = application.user.acceptedApplicationsCount || 0;
                
                // Initialize array if it doesn't exist
                if (!applicationSummary[acceptedCount]) {
                    applicationSummary[acceptedCount] = [];
                }
                
                // Add user to the appropriate array if not already there
                if (!applicationSummary[acceptedCount].some(u => u.id === application.user.id)) {
                    // Include necessary user data
                    const userData = {
                        id: application.user.id,
                        firstName: application.user.firstName,
                        lastName: application.user.lastName,
                        applicationId: application.id,
                    };
                    
                    applicationSummary[acceptedCount].push(userData);
                }
            }
        }

        return applicationSummary;
    }
}