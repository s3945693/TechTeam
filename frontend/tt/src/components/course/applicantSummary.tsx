"use client";

import { applicant } from "@/types/applicant";
import { course } from "@/types/course";
import { user } from "@/types/user";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ApplicantSummaryProps {
    course: course;
}

interface applicantSummary {
    applicationId: number;
    firstName: string;
    lastName: string;
    id: number;
}

export default function ApplicantSummary({ course }: ApplicantSummaryProps) {

    const [applicantSummary, setApplicantSummary] = useState<{ [key: number]: applicantSummary[] }>({});

    useEffect(() => {
        const fetchApplicants = async () => {
            const response = await fetch(`http://localhost:3001/api/applications/summary/course/${course.id}`);
            const data = await response.json();
            setApplicantSummary(data);
        }
        fetchApplicants();
    }, []);
    
    return (
        <Box sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h4" component="div">
                Applicant Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Here are the details of the applicants for this course.
            </Typography>
            <Typography variant="body2" color="text.secondary">
                The following applicants have applied to other courses and have been accepted:
            </Typography>
            {
                Object.keys(applicantSummary).length > 0 &&
                (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Total Amount of Courses Applicants have been accepted into</TableCell>
                                <TableCell>Applicant IDs</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                Object.entries(applicantSummary).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>{value.map((applicant) => applicant.applicationId).join(', ')}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                )
            }
        </Box>
    );
}