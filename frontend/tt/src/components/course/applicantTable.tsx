"use client";
import { applicant } from "@/types/applicant";
import { course } from "@/types/course";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

interface applicantProps {
    course: course;
    applicants: applicant[];
}

export default function ApplicantTable({ course, applicants:initialApplicants }: applicantProps) {
    const [applicants, setApplicants] = useState<applicant[] | undefined | null>(initialApplicants);
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof applicant>("id");
    const [pendingChanges, setPendingChanges] = useState<{ [key: number]: Partial<applicant> }>({});

    const handleSort = (property: keyof applicant) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    useEffect(() => {
        setApplicants(initialApplicants);
    }, [initialApplicants]);

    const handleApplicantChange = (
        id: number,
        field: keyof applicant,
        value: any
    ) => {
        // Update pending changes
        setPendingChanges(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));

        // Update local state immediately
        setApplicants(prev => {
            if (!prev) return prev;
            return prev.map(app => 
                app.id === id ? { ...app, [field]: value } : app
            );
        });
    };

    const handleSaveChanges = async (id: number) => {
        if (!applicants) return;
        
        // Get the changes for this specific applicant
        const changes = pendingChanges[id];
        if (!changes) return;

        try {
            // Send changes to backend
            await axios.post(`http://localhost:3001/api/applications/${id}`, changes);
            
            // Update local state
            setApplicants(prev => 
                prev ? prev.map(app => 
                    app.id === id ? { ...app, ...changes } : app
                ) : []
            );
            
            // Clear pending changes for this applicant
            setPendingChanges(prev => {
                const newChanges = { ...prev };
                delete newChanges[id];
                return newChanges;
            });
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const sortedApplicants = useMemo(() => {
        if (!applicants) return [];
        return [...applicants].sort((a, b) => {
            let valueA = a[orderBy];
            let valueB = b[orderBy];
            // For arrays, sort based on joined string
            if (Array.isArray(valueA)) valueA = valueA.join(", ");
            if (Array.isArray(valueB)) valueB = valueB.join(", ");
            // Compare after converting to string (or number if needed)
            if (typeof valueA === "number" && typeof valueB === "number") {
                return order === "asc" ? valueA - valueB : valueB - valueA;
            }
            return order === "asc"
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });
    }, [applicants, order, orderBy]);

    const handleAcceptApplicant = (id: number) => {
        axios.post(`http://localhost:3001/api/applications/accept/${id}`)
            .then((response) => {
                setApplicants((prev) =>
                    prev ? prev.map((app) => (app.id === id ? { ...app, status: "Accepted" } : app)) : []
                );
            })
            .catch((error) => {
                console.error("Error accepting applicant:", error);
            });
    }
    
    return (
        <Box>
            <Typography variant="h5" component="div" align="center" sx={{ marginBottom: 3 }}>
                Applicants for Course ID: {course.internal_course_id}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                { id: "id", label: "Applicant ID" },
                                { id: "name", label: "Applicant Name" },
                                { id: "email", label: "Applicant Email" },
                                { id: "skill_list", label: "Applicant Skill List" },
                                { id: "previous_roles", label: "Applicant Experience" },
                                { id: "academic_credentials", label: "Academic Credentials" },
                                { id: "status", label: "Applicant Status" },
                                { id: "availability", label: "Applicant Availablity" },
                                { id: "comments", label: "Applicant Comment" },
                                { id: "ranking", label: "Ranking" },
                            ].map((headCell) => (
                                <TableCell key={headCell.id}>
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : "asc"}
                                        onClick={() =>
                                            handleSort(headCell.id as keyof applicant)
                                        }
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell>Accept Applicant</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedApplicants.map((applicant) => (
                            <TableRow key={applicant.id}>
                                <TableCell>{applicant.id}</TableCell>
                                <TableCell>
                                    {`${applicant.user.firstName} ${applicant.user.lastName || '[missing last name]'}`}
                                </TableCell>
                                <TableCell>{applicant.user.email}</TableCell>
                                <TableCell>
                                {applicant.user.userSkills
                                    ? applicant.user.userSkills
                                        .map((skill) => skill.skill.name)
                                        .join(", ")
                                    : "No skills"}
                                </TableCell>                                
                                <TableCell>
                                    {applicant.user.previous_roles?.join(", ") || "No previous roles"}
                                </TableCell>
                                <TableCell>
                                    {applicant.user.academic_credentials?.join(", ") || "No academic credentials"}
                                </TableCell>
                                <TableCell>{applicant.status}</TableCell>
                                <TableCell>{applicant.availability}</TableCell>
                                <TableCell>
                                    <TextField
                                        variant="outlined"
                                        value={applicant.comments || ""}
                                        disabled={applicant.status === "Pending"}
                                        onChange={(e) =>
                                            handleApplicantChange(
                                                applicant.id,
                                                "comments",
                                                e.target.value
                                            )
                                        }
                                        sx={{
                                            ...(applicant.status === "Pending" && {
                                            backgroundColor: '#f0f0f0',
                                            '& .MuiInputBase-input': { color: '#888888' },
                                            }),
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        variant="outlined"
                                        type="number"
                                        disabled={applicant.status === "Pending"}
                                        value={applicant.ranking ?? ""}
                                        onChange={(e) =>
                                            handleApplicantChange(
                                                applicant.id,
                                                "ranking",
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                        sx={{
                                            ...(applicant.status === "Pending" && {
                                            backgroundColor: '#f0f0f0',
                                            '& .MuiInputBase-input': { color: '#888888' },
                                            }),
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {applicant.status === "Pending" ? (
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleAcceptApplicant(applicant.id)}
                                        >
                                            Accept
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleSaveChanges(applicant.id)}
                                            disabled={!pendingChanges[applicant.id]}
                                        >
                                            Save
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}