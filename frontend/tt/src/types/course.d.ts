import { INTERNALS } from "next/dist/server/web/spec-extension/request";
import { user } from "./user";
import { applicant } from "./applicant";

export interface course {
    id: number;
    name: string;
    description: string;
    internal_course_id: string;
    session_type: 'Tutorial' | 'Lab';
    assigned_lecturer: user | null;
    applications: applicant[];
}