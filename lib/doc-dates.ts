import fs from "fs";
import path from "path";
import { cache } from "react";

type Frontmatter = Record<string, unknown> | undefined;

interface GitDocDates {
  createdAt?: string;
  updatedAt?: string;
}

interface GitDocDatesManifest {
  files?: Record<string, GitDocDates>;
}

function normalizeIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

const getGitDocDates = cache((): Record<string, GitDocDates> => {
  const metadataPath = path.join(
    process.cwd(),
    "content",
    ".doc-git-dates.json",
  );

  try {
    const raw = fs.readFileSync(metadataPath, "utf-8");
    const parsed = JSON.parse(raw) as GitDocDatesManifest;
    return parsed.files ?? {};
  } catch {
    return {};
  }
});

export function resolveDocDates(
  relativePath: string,
  frontmatter: Frontmatter,
  fallbackLastModified?: Date,
) {
  const gitDates = getGitDocDates()[relativePath];
  const publishedAt =
    normalizeIsoDate(frontmatter?.publishedAt) ??
    normalizeIsoDate(frontmatter?.date) ??
    normalizeIsoDate(gitDates?.createdAt);

  const updatedAt =
    normalizeIsoDate(frontmatter?.updatedAt) ??
    normalizeIsoDate(gitDates?.updatedAt) ??
    fallbackLastModified?.toISOString();

  return {
    publishedAt,
    updatedAt,
  };
}
