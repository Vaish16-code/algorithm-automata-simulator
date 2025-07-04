import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoMaster - Engineering Algorithm Simulator",
  description: "Interactive algorithm simulations for engineering students. Master Automata Theory, Algorithm Design, and Operating Systems through visual learning.",
  keywords: "algorithms, engineering, computer science, automata theory, operating systems, student tools",
  authors: [{ name: "AlgoMaster Team" }],
  openGraph: {
    title: "AlgoMaster - Engineering Algorithm Simulator",
    description: "Interactive algorithm simulations for engineering students",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-white`}
      >
        <ThemeProvider>
          <Header />
          <main className="bg-white dark:bg-white min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
