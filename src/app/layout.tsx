import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://askme-feedback.vercel.app/"),
  title: {
    default: "AskMe",
    template: "%s | AskMe",
  },
  description:
    "AskMe is a Q&A platform where you can ask questions and get clear, helpful answers.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "AskMe",
    "questions and answers",
    "Q&A platform",
    "community help",
    "knowledge sharing",
  ],
  authors: [{ name: "Saksham Shrestha" }],
  creator: "Saksham Shrestha",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Ask Me – Ask Questions, Get Answers",
    description: "Ask Me is a modern Q&A platform built with Next.js.",
    url: "https://yourdomain.com",
    siteName: "Ask Me",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ask Me Open Graph Image",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ask Me – Ask Questions, Get Answers",
    description: "Ask Me is a modern Q&A platform built with Next.js.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove browser extension attributes before React hydrates
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                  });
                });
                
                // Clean existing attributes
                document.addEventListener('DOMContentLoaded', function() {
                  const elements = document.querySelectorAll('[bis_skin_checked]');
                  elements.forEach(function(el) {
                    el.removeAttribute('bis_skin_checked');
                  });
                });
                
                // Observe future additions
                if (typeof document !== 'undefined') {
                  observer.observe(document.documentElement, {
                    attributes: true,
                    attributeOldValue: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
