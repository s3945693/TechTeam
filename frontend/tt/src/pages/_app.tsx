// filepath: /src/pages/_app.tsx
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Box } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        // Instead of minHeight, you might set height: "100vh"
        // (which is similar but leverages grid to push footer down)
        height: "100vh",
      }}
    >
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </Box>
  );
}