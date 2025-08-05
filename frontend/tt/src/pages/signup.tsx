import React, { useState } from 'react';
import {
    Box, 
    TextField, 
    Button, 
    Typography, 
    Container,
    ToggleButtonGroup, 
    ToggleButton, 
    FormGroup,
    Link, 
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export default function SignupPage() {
    const [alignment, setAlignment] = useState<'Lecturer' | 'Candidate' | null>('Lecturer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: 'Lecturer' | 'Candidate' | null,
    ) => {
        setAlignment(newAlignment);
    };

    const handleSubmit = async () => {
        if (!validEmail() || !securePassword() || !validName(firstName) || !validName(lastName)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/users/signup', {
                email,
                password,
                firstName,
                lastName,
                role: alignment,
                previous_roles: [],
                academic_credentials: [],
                number_of_accepted_applications: 0
            });

            if (response.data) {
                toast.success('Sign Up successful!');
                window.location.href = '/login';
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    toast.error('Please check your input and try again');
                } else if (error.response?.status === 409) {
                    toast.error('Email already exists');
                } else {
                    toast.error('An error occurred during signup. Please try again.');
                }
            }
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validEmail = () => {
        const emailPattern = /^([A-Za-z0-9.]+)@([A-Za-z0-9.]+)$/;
        return emailPattern.test(email);
    }

    const securePassword = () => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()]{8,}$/;
        return passwordPattern.test(password);
    }

    const validName = (name: string) => {
        const namePattern = /^[A-Za-z\s]+$/;
        return namePattern.test(name);
    }

    return (
        <Box>
            <Container maxWidth="sm" sx={{ marginTop: 8, padding: 4 }}>
            <Box
                sx={{
                    backgroundColor: 'white',
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    sx={{
                    display: 'flex',
                    width: '100%',
                    '& .MuiToggleButton-root': { flex: 1 }
                    }}
                >
                    <ToggleButton value="Lecturer">Lecturer</ToggleButton>
                    <ToggleButton value="Candidate">Candidate</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box
                sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                padding: 4,
                }}
            >
                <Typography variant="h5" component="div" align="center" sx={{ marginBottom: 3 }}>
                    {alignment} Sign Up
                </Typography>

                <FormGroup>
                    <TextField
                        label="First Name"
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        helperText={!validName(firstName) && firstName.length > 0 ? "Please enter a valid first name" : ""}
                        error={!validName(firstName) && firstName.length > 0}
                    />
                    <TextField
                        label="Last Name"
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        helperText={!validName(lastName) && lastName.length > 0 ? "Please enter a valid last name" : ""}
                        error={!validName(lastName) && lastName.length > 0}
                    />
                    <TextField
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        helperText={!validEmail() && email.length > 0 ? "Please enter a valid email address" : ""}
                        error={!validEmail() && email.length > 0}
                    />
                    <TextField
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        helperText={!securePassword() && password.length > 0 ? "Password must be at least 8 characters long and contain at least one letter and one number" : ""}
                        error={!securePassword() && password.length > 0}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!validEmail() || !securePassword() || !validName(firstName) || !validName(lastName) || isLoading}
                        fullWidth
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                        }}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                        Already have an account?{" "}
                        <Link 
                            href="/login" 
                            underline="hover"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Log In
                        </Link>
                    </Typography>
                    <ToastContainer />
                </FormGroup>
            </Box>
            </Container>
        </Box>
    );
};