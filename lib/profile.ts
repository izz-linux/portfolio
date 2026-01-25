import profileData from "@/data/profile.json";

export type LinkItem = { label: string; target?: string; rel?: string; href: string };

export type ExperienceItem = {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM or null for Present
  summary?: string;
  bullets: string[];
  skillsUsed?: string[];
};

export type SkillGroup = { group: string; items: string[] };

export type Profile = {
  name: string;
  headline: string;
  links?: LinkItem[];
  summary?: string[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  keywords: string[];
};

export function getProfile(): Profile {
  // profile.json is imported at build time
  return profileData as Profile;
}
