import { candidate } from "./candidate";
import { user } from "./user";

export interface applicant {
    id: number;
    availability: 'Part Time' | 'Full Time';
    ranking: number | null;
    status: 'Pending' | 'Accepted';
    comments: string | null;
    user: user;
}