"use client"
import CourseTable from '@/components/courses/courseTable'
import { Box, Typography } from '@mui/material'
import { listOfPreDefinedCourses } from "@/users/courses"
import { useEffect, useState } from 'react'
import { course } from '@/types/course'
import axios from 'axios'

export default function Courses() {
  const [courses, setCourses] = useState<course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoursesForLecturer = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/courses/lecturer/${userId}`)
      setCourses(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching courses for lecturer:', err)
      setError('Failed to load courses for lecturer')
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/courses')
      setCourses(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses')
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      console.error('User not found in local storage')
      return
    }
    const parsedUser = JSON.parse(user)
    const userRole = parsedUser.role
    const userId = parsedUser.id
    if (userRole === 'Lecturer') {
      fetchCoursesForLecturer(userId)
    } else {
      fetchCourses()
    }
  }, [])

  if (loading) {
    return <Typography>Loading courses...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <div>
      <CourseTable courses={courses} />
    </div>
  )
}