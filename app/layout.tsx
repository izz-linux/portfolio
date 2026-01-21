import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Izz Noland - Senior DevOps Engineer",
  description: "Interactive portfolio and resume of Izz Noland, a Senior DevOps Engineer and Site Reliability Expert with 20 years of experience managing large-scale cloud infrastructure, Kubernetes platforms, and Infrastructure as Code.",
  keywords: ["DevOps", "Site Reliability Engineering", "SRE", "Kubernetes", "AWS", "GCP", "Infrastructure as Code", "Terraform", "Cloud Infrastructure"],
  authors: [{ name: "Izz Noland" }],
  openGraph: {
    title: "Izz Noland - Senior DevOps Engineer",
    description: "Interactive portfolio showcasing 20 years of DevOps and SRE experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
