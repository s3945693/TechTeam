"use client"
import CourseMain from '@/components/course/course'
import { course } from "@/types/course"
import { Box, Card, CardContent, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

 
export default function Courses() {
  const [course, setCourse] = useState<course | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      setCourseId(router.query.id as string);
    }
  }, [router.query.id]);
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const response = await axios.get(`http://localhost:3001/api/courses/${courseId}`)
        if (response.status === 200) {
          setCourse(response.data)
        } else {
          console.error('Failed to fetch course')
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      }
    }

    fetchCourse()
  }
  , [courseId])
  

  return (
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
                Course ID: {course?.internal_course_id || 'N/A'}
              </Typography>
              {course ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Course Name: {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {course.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Number of Applicants: {course.applications.length}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Course details are not available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box>
            {course && <CourseMain course={course} />}
        </Box>
    </Box>

  )
}