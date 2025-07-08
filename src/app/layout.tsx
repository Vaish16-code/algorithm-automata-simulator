import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import GlobalAlgorithmChatbot from "@/components/GlobalAlgorithmChatbot";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AlgoMaster - #1 Engineering Algorithm Simulator | Interactive CS Learning Platform",
    template: "%s | AlgoMaster - Interactive Algorithm Learning"
  },
  description: "Master computer science algorithms with interactive visual simulations. Complete platform for Automata Theory, Algorithm Design & Analysis, Operating Systems, and Computer Networks for engineering exam preparation and practical learning.",
  keywords: [
    "algorithm simulator",
    "engineering algorithms", 
    "computer science education",
    "automata theory simulator",
    "algorithm design and analysis",
    "operating systems algorithms",
    "computer networks protocols",
    "interactive learning platform",
    "engineering exam preparation",
    "CS algorithm visualization",
    "University algorithms",
    "VTU computer science",
    "AKTU engineering",
    "finite automata simulator",
    "turing machine simulator",
    "graph algorithms visualizer",
    "CPU scheduling simulator",
    "memory management algorithms",
    "network routing protocols",
    "data structures and algorithms",
    "competitive programming prep",
    "engineering student tools",
    "algorithm complexity analysis",
    "step by step algorithm learning",
    "free algorithm simulator",
    "DFA simulator",
    "context free grammar",
    "regular expressions",
    "pushdown automata",
    "dynamic programming",
    "greedy algorithms",
    "divide and conquer",
    "backtracking algorithms",
    "branch and bound",
    "CPU scheduling algorithms",
    "page replacement algorithms",
    "disk scheduling",
    "deadlock detection",
    "process synchronization",
    "routing protocols",
    "network security",
    "IP addressing",
    "data compression",
    "Huffman coding",
    "engineering college preparation",
    "B.Tech computer science",
    "gate preparation algorithms",
    "placement preparation",
    "coding interview prep"
  ],
  authors: [{ name: "AlgoMaster Team", url: "https://algomaster.app" }],
  creator: "AlgoMaster - Interactive Algorithm Learning Platform",
  publisher: "AlgoMaster",
  category: "Education Technology",
  classification: "Computer Science Education Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://algomaster.app",
    siteName: "AlgoMaster - Interactive Algorithm Simulator",
    title: "AlgoMaster - #1 Engineering Algorithm Simulator | Interactive CS Learning",
    description: "Master computer science algorithms with interactive visual simulations. Complete platform for engineering students covering Automata Theory, Algorithm Design, Operating Systems, and Computer Networks.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AlgoMaster - Interactive Algorithm Learning Platform for Engineering Students",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg", 
        width: 400,
        height: 400,
        alt: "AlgoMaster Algorithm Simulator",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AlgoMasterApp",
    creator: "@AlgoMasterApp", 
    title: "AlgoMaster - #1 Engineering Algorithm Simulator",
    description: "Master CS algorithms with interactive visual simulations. Free algorithm learning platform for engineering students.",
    images: ["/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://algomaster.app",
    languages: {
      'en-IN': 'https://algomaster.app',
      'en-US': 'https://algomaster.app/en-us',
      'hi-IN': 'https://algomaster.app/hi',
    },
  },
  other: {
    "msapplication-TileColor": "#2d89ef",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "AlgoMaster",
    "application-name": "AlgoMaster",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "rating": "General",
    "distribution": "Global",
    "revisit-after": "1 days",
    "target": "all",
    "audience": "engineering students, computer science students, algorithm learners",
    "coverage": "Worldwide",
    "subject": "Algorithm Learning, Computer Science Education, Engineering Exam Preparation",
    "copyright": "© 2024 AlgoMaster. All rights reserved.",
    "date": new Date().toISOString().split('T')[0],
    "geo.region": "IN",
    "geo.country": "India", 
    "geo.placename": "India",
    "ICBM": "20.5937, 78.9629",
    "DC.title": "AlgoMaster - Interactive Algorithm Simulator",
    "DC.creator": "AlgoMaster Team",
    "DC.subject": "Algorithm Education, Computer Science Learning",
    "DC.description": "Interactive algorithm simulator for engineering students",
    "DC.publisher": "AlgoMaster",
    "DC.contributor": "Engineering Educators",
    "DC.date": new Date().toISOString().split('T')[0],
    "DC.type": "Service",
    "DC.format": "text/html",
    "DC.identifier": "https://algomaster.app",
    "DC.language": "en-IN",
    "DC.coverage": "India",
    "DC.rights": "© 2024 AlgoMaster",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      bing: ["your-bing-verification-code"],
      yahoo: ["your-yahoo-verification-code"],
    }
  },
  appleWebApp: {
    capable: true,
    title: "AlgoMaster",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  metadataBase: new URL("https://algomaster.app"),
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "AlgoMaster",
    "alternateName": "AlgoMaster - Interactive Algorithm Learning Platform",
    "description": "Interactive algorithm simulator for engineering students covering Automata Theory, Algorithm Design & Analysis, Operating Systems, and Computer Networks",
    "url": "https://algomaster.app",
    "logo": "https://algomaster.app/logo.png",
    "sameAs": [
      "https://twitter.com/AlgoMasterApp",
      "https://github.com/algomaster",
      "https://linkedin.com/company/algomaster"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "help.algomaster@gmail.com"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Algorithm Learning Courses",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "Automata Theory & Formal Languages",
          "description": "Interactive simulators for DFA, NFA, PDA, and Turing Machines",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "AlgoMaster"
          }
        },
        {
          "@type": "Course", 
          "name": "Algorithm Design & Analysis",
          "description": "Dynamic Programming, Greedy, Divide & Conquer, Backtracking algorithms",
          "provider": {
            "@type": "EducationalOrganization", 
            "name": "AlgoMaster"
          }
        },
        {
          "@type": "Course",
          "name": "Operating Systems",
          "description": "CPU Scheduling, Memory Management, Process Synchronization simulators",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "AlgoMaster"
          }
        },
        {
          "@type": "Course",
          "name": "Computer Networks",
          "description": "Network protocols, routing algorithms, and communication simulations",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "AlgoMaster"
          }
        }
      ]
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "engineering students"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "50",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <html lang="en" className="light">
      <head>
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          strategy="beforeInteractive"
        />
        
        {/* Google AdSense (Replace ca-pub-XXXXXXXXXXXXXXXX with your actual AdSense ID) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* TODO: After AdSense approval, replace ca-pub-XXXXXXXXXXXXXXXX with your actual publisher ID */}
        
        {/* Google Analytics (Replace GA_MEASUREMENT_ID with your actual ID) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
            // TODO: Replace GA_MEASUREMENT_ID above with your actual Google Analytics ID
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-white`}
      >
        <ThemeProvider>
          <ChatbotProvider>
            <Header />
            <main className="bg-white dark:bg-white min-h-screen">{children}</main>
            <Footer />
            <GlobalAlgorithmChatbot />
          </ChatbotProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
