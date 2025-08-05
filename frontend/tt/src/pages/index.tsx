// src/pages/index.tsx
import { Box, Container, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { user } from "@/types/user";
import ProfileFeature from "@/components/home/profileFeature";
export default function Home() {
  const [user, setUser] = useState<user | null>(null);
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      const parsedUser = JSON.parse(userFromLocalStorage);
      setUser(parsedUser);
    }
  }, []);
  return (
    <>
    { user ? (
      <ProfileFeature />
    ) :(
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
        <Container maxWidth="md">
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
              Welcome to TeachTeam
            </Typography>

            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              Connecting Candidates and Lecturers Seamlessly
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Teach Team is a platform that allows users to apply to be candidates and allows lecturers to review applications and chose candidates.
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Feel free to create your own account and explore the platform, through the login button.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4 }}
              href="/login"
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    )}
    </>
  );
}
