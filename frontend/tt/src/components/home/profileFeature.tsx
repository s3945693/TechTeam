"use client";

import { user } from "@/types/user";
import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfileFeature() {
    
    const [user, setUser] = useState<user | null>(null);

    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem("user");
        if (userFromLocalStorage) {
            const parsedUser = JSON.parse(userFromLocalStorage);
            const id = parsedUser.id;
            axios.get(`http://localhost:3001/api/users/${id}`)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }

    }, []);

    
    return (
        <>
        { user && 
        (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundImage: "linear-gradient(to right, white, white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                }}
            >
                <Container>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 4,
                            boxShadow: 4,
                            padding: { xs: 3, md: 6 },
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h2" component="h1" gutterBottom>
                            Welcome {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Email: {user.email}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Role: {user.role}
                        </Typography>
                        {user.previous_roles && (
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Previous Roles: {user.previous_roles.join(", ")}
                            </Typography>
                        )}
                        {user.academic_credentials && (
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Academic Credentials: {user.academic_credentials.join(", ")}
                            </Typography>
                        )}
                        {user.userSkills && (
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Skills: {user.userSkills.map((skill) => skill.skill.name).join(", ")}
                            </Typography>
                        )}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Joined on {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Container>
            </Box>
        )}
        </>
    );
}