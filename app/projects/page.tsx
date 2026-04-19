"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { getProjects } from "@/lib/projects";
import { FeaturedProject } from "@/components/FeaturedProject";
import { ProjectTile } from "@/components/ProjectTile";
import { LAYOUT, SPACING } from "@/lib/constants";

export default function ProjectsPage() {
  const profile = useMemo(() => getProfile(), []);
  const { projects } = useMemo(() => getProjects(), []);

  const featured = projects.filter((p) => p.featured);
  const grid = projects.filter((p) => !p.featured);

  return (
    <main className={`mx-auto ${LAYOUT.MAX_WIDTH} ${LAYOUT.PAGE_PADDING_X} ${LAYOUT.PAGE_PADDING_Y}`}>
      <header className={SPACING.sm.spaceY}>
        <div>
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.name}
            </h1>
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {profile.headline}
          </div>
        </div>

        {profile.links?.length ? (
          <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm`}>
            {profile.links.map((l) => {
              const isCurrent = l.href === "/projects";
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.target}
                  rel={l.rel}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "underline decoration-gray-700 underline-offset-4 text-gray-900 dark:decoration-gray-300 dark:text-gray-100"
                      : "underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
                  }
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        ) : null}
      </header>

      <section className={`${SPACING.xl.mt} ${SPACING.lg.spaceY}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Featured
        </h2>
        <div className={SPACING.lg.spaceY}>
          {featured.map((p) => (
            <FeaturedProject key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className={`${SPACING.xl.mt} ${SPACING.lg.spaceY}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          More projects
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p) => (
            <ProjectTile key={p.id} project={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
