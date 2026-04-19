"use client";

import { Highlight, themes } from "prism-react-renderer";

export type CodeSnippetProps = {
  code: string;
  language: string;
  caption?: string;
};

export function CodeSnippet({ code, language, caption }: CodeSnippetProps) {
  return (
    <figure data-language={language} className="my-2">
      <div className="block dark:hidden">
        <Highlight theme={themes.github} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} rounded-md border border-gray-200 p-4 text-xs overflow-x-auto`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      <div className="hidden dark:block">
        <Highlight theme={themes.dracula} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} rounded-md border border-gray-700 p-4 text-xs overflow-x-auto`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
