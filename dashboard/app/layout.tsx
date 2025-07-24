'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/header";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/lib/theme";
import { store } from "@/store";
import { Provider } from 'react-redux';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html >
  );
}
