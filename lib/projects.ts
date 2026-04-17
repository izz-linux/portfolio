import projectsData from "@/data/projects.json";

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "code"; code: string; language: string; caption?: string };

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  tech: string[];
  repo?: string;
  repoPrivate?: boolean;
  demo?: string;
  featured: boolean;
  media?: ProjectMedia;
};

export type ProjectsData = {
  projects: Project[];
};

export function getProjects(): ProjectsData {
  return projectsData as ProjectsData;
}
