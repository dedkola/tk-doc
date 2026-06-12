import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const repoRoot = process.cwd();
const contentDir = path.join(repoRoot, "content");
const outputPath = path.join(contentDir, ".doc-git-dates.json");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function runGit(args) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function getGitDates(relativePath) {
  const updatedAt = runGit([
    "log",
    "-1",
    "--follow",
    "--format=%cI",
    "--",
    relativePath,
  ]);
  const createdAt = runGit([
    "log",
    "--follow",
    "--diff-filter=A",
    "--format=%cI",
    "--",
    relativePath,
  ])
    .split("\n")
    .filter(Boolean)
    .at(-1);

  return {
    createdAt: createdAt || undefined,
    updatedAt: updatedAt || undefined,
  };
}

const files = Object.fromEntries(
  walk(contentDir)
    .map((fullPath) => {
      const relativePath = path.relative(contentDir, fullPath).replace(/\\/g, "/");
      const gitPath = `content/${relativePath}`;
      return [relativePath, getGitDates(gitPath)];
    })
    .filter(([, dates]) => dates.createdAt || dates.updatedAt),
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      files,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Generated ${outputPath}`);
