export interface user {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'Admin' | 'Candidate' | 'Lecturer';
    account_status: 'Active' | 'Inactive';
    previous_roles?: string[];
    academic_credentials?: string[];
    userSkills?: userSkills[];
    courses?: course[];
    number_of_accepted_applications?: number;
    createdAt: string;
    updatedAt: string;
}

export interface userSkills {
    user_id: number;
    skill_id: number;
    skill: skill;
}

export interface skill {
    id: number;
    name: string;
}
