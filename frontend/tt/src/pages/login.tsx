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

export default function LoginPage() {
    const [alignment, setAlignment] = useState<'Lecturer' | 'Candidate' | null>('Lecturer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: 'Lecturer' | 'Candidate' | null,
    ) => {
        setAlignment(newAlignment);
    };

    const handleSubmit = async () => {
        if (!validEmail() || !password.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', {
                email,
                password,
                role: alignment
            });

            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success('Login successful!');
                window.location.href = '/';
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error('Invalid email or password');
            }
            else if (axios.isAxiosError(error) && error.response?.status === 403) {
                toast.error('Invalid role for this user');
            } 
            else {
                toast.error( 'An error occurred during login');
            }
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validEmail = () => {
        const emailPattern = /^([A-Za-z0-9.]+)@([A-Za-z0-9.]+)$/;
        return emailPattern.test(email);
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
                    {alignment} Sign In
                </Typography>

                <FormGroup>
                    <TextField
                        label="email"
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
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={ !validEmail() || !password.trim()}
                        fullWidth
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                        }}
                        onClick={handleSubmit}
                    >
                        Log In
                    </Button>
                    <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                        Don't have an account?{" "}
                        <Link 
                            href="/signup" 
                            underline="hover"
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Sign Up
                        </Link>
                    </Typography>
                    <ToastContainer />
                </FormGroup>
            </Box>
            </Container>
        </Box>
    );
};