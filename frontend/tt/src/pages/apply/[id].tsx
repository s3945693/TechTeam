import ApplicationForm from "@/components/courses/application"
import { course } from "@/types/course"
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export default function application() {
    const router = useRouter()
    const courseId = router.query.id as string;
    const [course, setCourse] = useState<course | null>(null)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/courses/${courseId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch course')
                }
                const data = await response.json()
                setCourse(data)
            } catch (error) {
                console.error('Error fetching course:', error)
            }
        }

        if (courseId) {
            fetchCourse()
        }

    }
    , [courseId])

    
    return (
        <Box>
            {course && (
                <Box>
                    <Box>
                        <Card sx={{ padding: 2, margin: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Course Details
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Here are the details of the course you selected.
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Course ID: {course.internal_course_id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Course Name: {course.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Description: {course.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Number of Applicants: {course.applications.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box>
                        <ApplicationForm courseId={courseId} />
                    </Box>
                </Box>
            )}
        </Box>
    
    )
}