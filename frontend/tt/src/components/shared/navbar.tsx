"use client"
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter()
    const sendHome = () => {
        router.push("/")
    }

    const sendLogin = () => {
        router.push("/login")
    }

    const sendCourses = () => {
        router.push("/courses")
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('candidate')
        setLoggedIn(false)
        toast.success('Logout successful!')
        router.push("/")
    }

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }
    , [])

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Button onClick={sendHome} color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 1 }} />
                </Button>
                { loggedIn && (
                    <Button onClick={sendCourses} color="inherit">Courses</Button>
                )}                
                <Box sx={{flexGrow:1}}/>
                {!loggedIn && (
                    <Button onClick={sendLogin} color="inherit">Login</Button>
                )}
                {loggedIn && (
                    <Button onClick={logout} color="inherit">Logout</Button>
                )}
            </Toolbar>
            <ToastContainer />
        </AppBar>
        </Box>
    );
}