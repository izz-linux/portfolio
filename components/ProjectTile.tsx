"use client";

import type { Project } from "@/lib/projects";
import { Badge } from "@/components/Badge";
import { LanguagePlaceholder } from "@/components/LanguagePlaceholder";
import { SPACING } from "@/lib/constants";

export type ProjectTileProps = {
  project: Project;
};

export function ProjectTile({ project }: ProjectTileProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div>
        {project.media?.kind === "image" ? (
          <img
            src={project.media.src}
            alt={project.media.alt}
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          <LanguagePlaceholder
            name={project.name}
            language={project.tech[0] ?? "Code"}
          />
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {project.name}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {project.tagline}
        </div>
      </div>

      <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
        {project.tech.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm mt-auto`}>
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
          >
            Source
          </a>
        ) : null}
        {project.repoPrivate ? (
          <span className="text-gray-500 dark:text-gray-400">Source private</span>
        ) : null}
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
          >
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}
