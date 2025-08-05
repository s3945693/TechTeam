//create dummy users

import { applicant } from "@/types/applicant";
import { candidate } from "@/types/candidate";
import { user } from "@/types/user";

export const users: user[] = [
    {
        id: 1,
        name: "Alice",
        email: "test@example.com",
        role: 'Lecturer'
    },
    {
        id: 2,
        name: "Dave",
        email: "test1@example.com",
        role: 'Lecturer'
    },
    {
        id: 3,
        name: "Shaun",
        email: "test2@example.com",
        role: 'Lecturer'
    },
    {
        id: 4,
        name: "Coby",
        email: "test3@example.com",
        role: 'Candidate'
    },
    {
        id: 5,
        name: "Liam",
        email: "test4@example.com",
        role: 'Candidate'
    },
    {
        id: 6,
        name: "John",
        email: "test5@example.com",
        role: 'Candidate'
    },
    {
        id: 7,
        name: "James",
        email: "test6@example.com",
        role: 'Candidate'
    }
]

export const candidates: candidate[] = [
    {
        id: 4,
        role: "Candidate",
        name: "Coby",
        email: "test3@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0
    },
    {
        id: 5,
        role: "Candidate",
        name: "Liam",
        email: "test4@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0
    },
    {
        id: 6,
        role: "Candidate",
        name: "John",
        email: "test5@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0
    },
    {
        id: 7,
        role: "Candidate",
        name: "James",
        email: "test6@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0
    }
]

export const applicants: applicant[] = [
    {
        id: 4,
        role: "Candidate",
        name: "Coby",
        email: "test3@example.com",
        skill_list: ["Math", "Science"],
        previous_roles: ["Math Course", "Science Course"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        number_of_accepted_applications: 0,
        status: "Pending",
        ranking: 2,
        availability: "Full Time",
        comments: "Good candidate",
    },
    {
        id: 5,
        role: "Candidate",
        name: "Liam",
        email: "test4@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0,
        status: "Accepted",
        ranking: 1,
        availability: "Part Time",
        comments: "Great applicant",
    },
    {
        id: 6,
        role: "Candidate",
        name: "John",
        email: "test5@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0,
        status: "Pending",
        ranking: 3,
        availability: "Full Time",
    },
    {
        id: 7,
        role: "Candidate",
        name: "James",
        email: "test6@example.com",
        skill_list: ["Math", "Science"],
        academic_credentials: ["PhD in Mathematics", "MSc in Physics"],
        previous_roles: ["Math Course", "Science Course"],
        number_of_accepted_applications: 0,
        status: "Accepted",
        ranking: 4,
        availability: "Part Time",
    }
]