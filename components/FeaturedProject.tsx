"use client";

import type { Project } from "@/lib/projects";
import { Badge } from "@/components/Badge";
import { CodeSnippet } from "@/components/CodeSnippet";
import { SPACING } from "@/lib/constants";

export type FeaturedProjectProps = {
  project: Project;
};

export function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <article className="flex flex-col md:flex-row md:gap-8 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <div className="md:w-1/2 min-w-0">
        {project.media?.kind === "image" ? (
          <figure>
            <img
              src={project.media.src}
              alt={project.media.alt}
              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-700"
            />
            {project.media.caption ? (
              <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {project.media.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        {project.media?.kind === "code" ? (
          <CodeSnippet
            code={project.media.code}
            language={project.media.language}
            caption={project.media.caption}
          />
        ) : null}
      </div>

      <div className={`md:w-1/2 ${SPACING.sm.spaceY}`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {project.name}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {project.tagline}
          </div>
        </div>

        {project.description ? (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {project.description}
          </p>
        ) : null}

        <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
          {project.tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm`}>
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
      </div>
    </article>
  );
}
