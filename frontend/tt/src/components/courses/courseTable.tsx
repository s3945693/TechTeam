"use client";

import { Box, Button, FormControl, FormGroup, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { use, useEffect, useState } from 'react';
import { course } from '@/types/course';
import { useRouter } from 'next/router';
import axios from 'axios';

interface CourseTableProps {
    courses: course[];
}


export default function CourseTable({ courses }: CourseTableProps) {
    // for future, we should disable already applied to courses
    const [role, setRole] = useState<'Candidate' | 'Lecturer' | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<course[]>(courses);
    const [filteredNameError, setFilteredNameError] = useState(false);

    const [filteredIdValue, setFilteredIdValue] = useState<string>('');
    const [filteredNameValue, setFilteredNameValue] = useState<string>('');
    const [listOfAppliedCourses, setListOfAppliedCourses] = useState<number[]>([]);
    const [userId, setUserId] = useState<string>('');
    const router = useRouter();

    const viewCourse = (courseId: number) => {
        router.push(`/course/${courseId}`)
    }
    const applyForCourse = (courseId:number) => {
        router.push(`/apply/${courseId}`)
    }

    const handleSubmit = (courseId:number) => {
        if (role === 'Candidate') {
            applyForCourse(courseId)
        }
        else {
            viewCourse(courseId)
        }
    }

    const hasUserApplied = (courseId: number): boolean => {
        return listOfAppliedCourses.includes(courseId);
    }
    

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilteredNameValue(event.target.value)
    }

    const handleFilterChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilteredIdValue(event.target.value)

        if (!event.target.value || event.target.value.length < 8) {
            setFilteredNameError(true)
            return
        }
        if (event.target.value.length === 8 && event.target.value.startsWith('COSC')) {
            if (!/^[0-9]+$/.test(event.target.value.slice(4))) {
                setFilteredNameError(true)
                return
            }
        }
        setFilteredIdValue(event.target.value)
        setFilteredNameError(false)

    }

    const handleApplicationOfFilters = async () => {
    
        try {
            // Make sure this URL matches your backend route configuration
            const response = await axios.get('http://localhost:3001/api/courses/filter', {
                params: {
                    role: role,
                    userId: userId,
                    internalCourseId: filteredIdValue || "",
                    courseName: filteredNameValue || "",
                },
            });
    
            setFilteredCourses(response.data);
        } catch (error) {
            console.error("Error filtering courses:", error);
        }
    };

    const clearFilters = () => {
        setFilteredIdValue('')
        setFilteredNameValue('')
        setFilteredCourses(courses)
    }

    useEffect(() => {

        const user = localStorage.getItem('user')
        if (user) {
            setUserId(JSON.parse(user).id)
            setRole(JSON.parse(user).role)
        }
        setFilteredCourses(courses)
    }
    , [])

    useEffect(() => {
        const getCandidateAppliedCourses = async () => {
            if (role === 'Candidate') {
                const response = await axios.get(`http://localhost:3001/api/courses/candidate/${userId}/applied`);
                const appliedCourses = response.data;
                setListOfAppliedCourses(appliedCourses);
            }
        }
        getCandidateAppliedCourses();
    }
    , [userId, role])

    return (
        <Box sx={{padding: 2}}>
            <Box>
                <Typography variant='h4' component='h2' gutterBottom>
                    Courses
                </Typography>
                <FormGroup>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <TextField 
                            label="Search by Course Name"
                            variant="outlined"
                            onChange={handleFilterChange}
                            placeholder='Course Name'
                            value={filteredNameValue}
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <TextField
                            label="Filter by Course ID"
                            variant="outlined"
                            onChange={handleFilterChangeId}
                            placeholder='COSCXXXX'
                            error={filteredNameError}
                            helperText={filteredNameError ? 'Please enter a valid course ID' : ''}
                            value={filteredIdValue}
                        />
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleApplicationOfFilters} sx={{ padding: 1}}>
                        Apply Filters
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={clearFilters} sx={{padding:1}}>
                        Clear Filters
                    </Button>
                </FormGroup>
            </Box>
            <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Course ID</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Number of Applicants</TableCell>
                        <TableCell>View Course</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell>{course.internal_course_id}</TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.applications.length}</TableCell>
                            <TableCell><Button disabled={hasUserApplied(course.id)} variant='contained' color='primary' onClick={() => handleSubmit(course.id)}>{role === 'Candidate' ? 'Apply' : 'View'}</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Box>
        </Box>
    )
}
