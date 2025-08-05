"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { user } from '@/types/user';

interface ApplicationFormProps {
    courseId: string;
}

export default function ApplicationForm({ courseId }: ApplicationFormProps) {
    const [candidate, setCandidate] = useState<user | null>(null);
    const [availability, setAvailability] = useState<'Part Time' | 'Full Time'>('Full Time');
    // Academic Credentials state
    const [academicInput, setAcademicInput] = useState<string>('');
    const [academicError, setAcademicError] = useState<boolean>(false);
    // Skill List state
    const [skillInput, setSkillInput] = useState<string>('');
    const [skillError, setSkillError] = useState<boolean>(false);
    // Previous Roles state
    const [rolesInput, setRolesInput] = useState<string>('');
    const [rolesError, setRolesError] = useState<boolean>(false);

    const router = useRouter();
    const regex = /^[A-Za-z\s,]*$/; // allow letters, spaces, and commas

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            console.error('User not found in local storage. Please log in.');
            return;
        }
        const parsedUser = JSON.parse(user);
        const userId = parsedUser.id;

        const getCandidateInformation = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
                if (response.status === 201) {
                    setCandidate(response.data);
                    setAcademicInput(response.data?.academic_credentials.join(', ') || '');
                    setSkillInput(response.data?.userSkills.map((userSkill: {skill: {name: string}}) => userSkill.skill.name).join(', ') || '');
                    setRolesInput(response.data?.previous_roles.join(', ') || '');
                } else {
                    console.error('Failed to fetch candidate information');
                }
            } catch (error) {
                console.error('Error fetching candidate information:', error);
            }
        }
        getCandidateInformation();
    }
    , []);


    // Generic handler to update list fields
    const handleListChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setInput: React.Dispatch<React.SetStateAction<string>>,
        setError: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        const value = e.target.value;
        if (regex.test(value)) {
            setInput(value);
            setError(false);
        } else {
            setError(true);
        }
    };

    const handleSubmit = async () => {
        const forbackend = {
            userId: candidate?.id,
            courseId: courseId,
            availability,
            academic_credentials: academicInput.split(',').map(item => item.trim()),
            skills: skillInput.split(',').map(item => item.trim()),
            previous_roles: rolesInput.split(',').map(item => item.trim()),
        }
        
        try {
            const response = await axios.post('http://localhost:3001/api/applications/create', forbackend);
            alert("Application submitted successfully");
            // Only navigate after successful submission
            router.push(`/courses`);
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Error submitting application");
            // Stay on the current page if there's an error
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            {candidate && (
                <Box>
                    <FormGroup>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Name"
                                value={`${candidate?.firstName} ${candidate.lastName}` || ''}
                                disabled
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Email"
                                value={candidate?.email || ''}
                                disabled
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Skill List"
                                value={skillInput}
                                onChange={(e) =>
                                    handleListChange(e, setSkillInput, setSkillError)
                                }
                                error={skillError}
                                helperText={
                                    skillError
                                        ? "Please input only letters, spaces, and commas"
                                        : "Please separate skills with commas"
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Previous Roles"
                                value={rolesInput}
                                onChange={(e) =>
                                    handleListChange(e, setRolesInput, setRolesError)
                                }
                                error={rolesError}
                                helperText={
                                    rolesError
                                        ? "Please input only letters, spaces, and commas"
                                        : "Please separate previous roles with commas"
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Academic Credentials"
                                value={academicInput}
                                onChange={(e) =>
                                    handleListChange(e, setAcademicInput, setAcademicError)
                                }
                                error={academicError}
                                helperText={
                                    academicError
                                        ? "Please input only letters, spaces, and commas"
                                        : "Please separate academic credentials with commas"
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="availability-label">Availability</InputLabel>
                            <Select
                                labelId="availability-label"
                                id="availability"
                                value={availability}
                                label="Availability"
                                onChange={(e) => setAvailability(e.target.value as 'Part Time' | 'Full Time')}
                            >
                                <MenuItem value="Part Time">Part Time</MenuItem>
                                <MenuItem value="Full Time">Full Time</MenuItem>
                            </Select>
                        </FormControl>
                    </FormGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!availability}
                        sx={{
                            marginTop: 2,
                        }}
                    >
                        Submit Application
                    </Button>
                </Box>
            )}
        </Box>
    );
}