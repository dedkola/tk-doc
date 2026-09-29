import type { ReactNode } from "react";
import Prism from "prismjs";
import { normalizeTokens } from "prism-react-renderer";
import "prismjs/components/prism-apacheconf";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-batch";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-hcl";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-nginx";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-promql";
import "prismjs/components/prism-python";
import "prismjs/components/prism-shell-session";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import { FileCode, Terminal } from "lucide-react";
import { prismLanguageAliases } from "@/config/code-languages.mjs";
import { CodeCopyButton } from "@/components/CodeCopyButton";

const fluxGrammar = {
  comment: {
    pattern: /\/\/.*/,
    greedy: true,
  },
  string: {
    pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  duration: {
    pattern: /\b\d+(?:ns|us|ms|s|m|h|d|w|mo|y)\b/,
    alias: "number",
  },
  keyword:
    /\b(?:and|bool|bytes|duration|else|exists|filter|float|from|if|import|in|int|not|option|or|package|return|string|then|time|uint|with)\b/,
  function: /\b[A-Za-z_]\w*(?=\s*\()/,
  number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i,
  boolean: /\b(?:false|true)\b/,
  operator: /\|>|=>|==|!=|<=|>=|=~|!~|[-+*/%<>=]/,
  punctuation: /[{}[\]();,.:]/,
};

for (const [alias, source] of Object.entries(prismLanguageAliases)) {
  Prism.languages[alias] = Prism.languages[source];
}
Prism.languages.flux = fluxGrammar;

interface CodeProps {
  children?: ReactNode;
  className?: string;
}

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent(
      (node as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

export function Code({ children = "", className = "" }: CodeProps) {
  const requestedLanguage =
    className
      .replace(/language-/, "")
      .replace(/\s+copy$/, "")
      .trim()
      .toLowerCase() || "text";
  const language = Prism.languages[requestedLanguage]
    ? requestedLanguage
    : "text";
  const grammar = Prism.languages[language] || Prism.languages.plain;
  const code = getTextContent(children).trim();
  const lines = grammar
    ? normalizeTokens(Prism.tokenize(code, grammar))
    : [[{ types: ["plain"], content: code }]];

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {language === "bash" || language === "sh" ? (
            <Terminal size={14} />
          ) : (
            <FileCode size={14} />
          )}
          <span className="uppercase tracking-wider">{requestedLanguage}</span>
        </div>
        <CodeCopyButton code={code} />
      </div>

      <pre
        className="code-highlight overflow-x-auto p-4 font-mono text-sm leading-relaxed"
        style={{ margin: 0, background: "transparent" }}
      >
        <code className="block min-w-full">
          {lines.map((line, lineIndex) => (
            <span className="table-row" key={lineIndex}>
              <span className="table-cell w-8 select-none pr-4 text-right text-xs text-border">
                {lineIndex + 1}
              </span>
              <span className="table-cell whitespace-pre">
                {line.map((token, tokenIndex) => (
                  <span
                    className={`token ${token.types.join(" ")}`}
                    key={tokenIndex}
                  >
                    {token.content}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
