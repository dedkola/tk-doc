import fs from "fs";
import path from "path";
import { supportedCodeLanguages } from "../config/code-languages.mjs";

const repoRoot = process.cwd();
const contentDir = path.join(repoRoot, "content");
const supportedLanguages = new Set(supportedCodeLanguages);
const issues = [];
let blockCount = 0;
let fileCount = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

function addIssue(filePath, line, message) {
  const relativePath = path.relative(repoRoot, filePath);
  issues.push(`${relativePath}:${line} ${message}`);
}

for (const filePath of walk(contentDir)) {
  fileCount += 1;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!fence) {
      const opening = line.match(/^ {0,3}```([^`]*)$/);
      if (!opening) continue;

      const info = opening[1].trim();
      const language = (info.split(/\s+/)[0] || "text").toLowerCase();
      fence = {
        line: index + 1,
        language,
        content: [],
      };
      blockCount += 1;
      continue;
    }

    if (/^ {0,3}```\s*$/.test(line)) {
      if (!fence.content.join("\n").trim()) {
        addIssue(filePath, fence.line, "contains an empty code fence");
      }
      if (!supportedLanguages.has(fence.language)) {
        addIssue(
          filePath,
          fence.line,
          `uses unsupported language '${fence.language}'`,
        );
      }
      fence = null;
      continue;
    }

    fence.content.push(line);
  }

  if (fence) {
    addIssue(filePath, fence.line, "contains an unclosed code fence");
  }
}

if (issues.length > 0) {
  console.error(`Code fence validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${blockCount} code fences across ${fileCount} MDX files.`,
  );
}
