export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import {Toaster} from "react-hot-toast"
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genforma.vercel.app"),

  title: "GenForm AI",
  description: "Transform ideas into beautiful forms with AI magic. Create, customize, and share professional forms in seconds.",

  openGraph: {
    title: "GenForm AI",
    description: "Transform ideas into beautiful forms with AI magic. Create, customize, and share professional forms in seconds.",
    url: "https://genforma.vercel.app",
    siteName: "GenForm AI",
    images: [
      {
        url: "/GenForm-Preview.png",
        width: 1200,
        height: 630,
        alt: "GenForm AI",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GenForm AI",
    description: "Transform ideas into beautiful forms with AI magic. Create, customize, and share professional forms in seconds.",
    images: ['/GenForm-Preview.png']
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <Toaster/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}