import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "./" },
  title: "Platform Engineering, DevOps & SRE Portfolio | Izz Noland",
  description: "Interactive resume and work history: 20 years of platform engineering, SRE, and DevOps across Kubernetes, Terraform, AWS, and GCP, including roles at Stord, theScore, and Samcart.",
  keywords: ["DevOps", "Site Reliability Engineering", "SRE", "Kubernetes", "AWS", "GCP", "Infrastructure as Code", "Terraform", "Cloud Infrastructure"],
  authors: [{ name: "Izz Noland" }],
  openGraph: {
    title: "Platform Engineering, DevOps & SRE Portfolio | Izz Noland",
    description: "Interactive portfolio showcasing 20 years of DevOps, SRE, and Infrastructure experience",
    type: "website",
    url: "./",
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
