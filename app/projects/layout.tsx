import type { Metadata } from "next";

const title = "Platform Engineering & DevOps Projects | Izz Noland";
const description =
  "Open-source and personal engineering projects: multi-agent tooling, Terraform modules, GCP IPAM, and developer tools in Rust, Go, and TypeScript.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title, description, type: "website", url: "/projects" },
};

export default function ProjectsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
