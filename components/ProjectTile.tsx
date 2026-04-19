"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import { Badge } from "@/components/Badge";
import { LanguagePlaceholder } from "@/components/LanguagePlaceholder";
import { Lightbox } from "@/components/Lightbox";
import { SPACING } from "@/lib/constants";

export type ProjectTileProps = {
  project: Project;
};

export function ProjectTile({ project }: ProjectTileProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const image = project.media?.kind === "image" ? project.media : null;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div>
        {image ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block w-full cursor-zoom-in"
            aria-label={`Enlarge image: ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-32 object-cover rounded-md"
            />
          </button>
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

      {image && lightboxOpen ? (
        <Lightbox src={image.src} alt={image.alt} onClose={() => setLightboxOpen(false)} />
      ) : null}
    </article>
  );
}
