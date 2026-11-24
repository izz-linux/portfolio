import type { Profile } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

export function buildProfilePage(profile: Profile) {
  const current = profile.experience.find((e) => e.endDate === null);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: `${SITE_URL}/`,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      description: profile.headline,
      url: `${SITE_URL}/`,
      ...(current && {
        hasOccupation: { "@type": "Occupation", name: current.title },
        worksFor: { "@type": "Organization", name: current.company },
      }),
      knowsAbout: profile.keywords,
      sameAs: (profile.links ?? []).map((l) => l.href).filter((href) => href.startsWith("https://")),
    },
  };
}

export function buildWebSite(profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: `${profile.name} Portfolio`,
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
