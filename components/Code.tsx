"use client";

import React, { useEffect, useState } from "react";
import { Highlight, themes, Prism as PrismLib } from "prism-react-renderer";
import { useTheme } from "next-themes";

// ESM imports are hoisted and run before top-level code.
// Language components from `prismjs` expect a global `Prism` to exist at load time.
// To ensure correct order in the browser, we assign `globalThis.Prism` and
// then dynamically import language definitions on the client.
if (typeof window !== "undefined") {
  // ensure global Prism for prismjs components
  globalThis.Prism = PrismLib;
}

import { Copy, Check, Terminal, FileCode } from "lucide-react";

interface CodeProps {
  children?: React.ReactNode;
  className?: string;
}

// Map of language to its Prism component import path
const LANGUAGE_IMPORTS: Record<string, () => Promise<unknown>> = {
  bash: () => import("prismjs/components/prism-bash"),
  sh: () => import("prismjs/components/prism-bash"),
  shell: () => import("prismjs/components/prism-bash"),
  "shell-session": () => import("prismjs/components/prism-shell-session"),
  docker: () => import("prismjs/components/prism-docker"),
  dockerfile: () => import("prismjs/components/prism-docker"),
  yaml: () => import("prismjs/components/prism-yaml"),
  yml: () => import("prismjs/components/prism-yaml"),
  json: () => import("prismjs/components/prism-json"),
  markdown: () => import("prismjs/components/prism-markdown"),
  md: () => import("prismjs/components/prism-markdown"),
  python: () => import("prismjs/components/prism-python"),
  py: () => import("prismjs/components/prism-python"),
  sql: () => import("prismjs/components/prism-sql"),
  diff: () => import("prismjs/components/prism-diff"),
  hcl: () => import("prismjs/components/prism-hcl"),
  "markup-templating": () => import("prismjs/components/prism-markup-templating"),
  php: () => import("prismjs/components/prism-php"),
};

// Cache loaded languages to avoid duplicate imports
const loadedLanguages = new Set<string>();

// Load only the language components actually needed
async function loadLanguageIfNeeded(language: string): Promise<void> {
  if (!language || language === "text" || loadedLanguages.has(language)) {
    return;
  }

  const importFn = LANGUAGE_IMPORTS[language.toLowerCase()];
  if (!importFn) {
    // Language not in our list, that's okay (Prism has built-in support for many)
    return;
  }

  try {
    await importFn();
    loadedLanguages.add(language);
  } catch (e) {
    console.warn(`Failed to load Prism language component for "${language}":`, e);
  }
}

export function Code({ children = "", className = "" }: CodeProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const language =
    className
      .replace(/language-/, "")
      .replace(/\s+copy$/, "")
      .trim() || "text";

  // Load language component only when needed
  useEffect(() => {
    if (typeof window === "undefined") return;
    globalThis.Prism = PrismLib;
    loadLanguageIfNeeded(language);
  }, [language]);

  // Extract text content from children (handles both string and React nodes)
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (node && typeof node === "object" && "props" in node) {
      return getTextContent(
        (node as { props: { children?: React.ReactNode } }).props.children,
      );
    }
    return "";
  };

  const code = getTextContent(children).trim();

  const handleCopy = async () => {
    if (!code) {
      console.warn("No code to copy");
      return;
    }

    const fallbackCopy = () => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        return false;
      }
    };

    const canUseClipboard =
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      // Clipboard API requires a secure context (HTTPS) in most browsers
      // localhost is typically treated as secure, but guard just in case
      (!!(window as unknown as { isSecureContext?: boolean }).isSecureContext ||
        location.hostname === "localhost") &&
      !!navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function";

    let success = false;
    if (canUseClipboard) {
      try {
        await navigator.clipboard.writeText(code);
        success = true;
      } catch (err) {
        // Permission or transient failure: warn and fall back
        console.warn("Clipboard API failed, using fallback:", err);
        success = fallbackCopy();
      }
    } else {
      // Expected in non-secure contexts or older browsers
      console.warn("Clipboard API not available, using fallback");
      success = fallbackCopy();
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          {language === "bash" || language === "sh" ? (
            <Terminal size={14} />
          ) : (
            <FileCode size={14} />
          )}
          <span className="uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          type="button"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              <span className="text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Line Numbers */}
      <Highlight
        theme={resolvedTheme === "dark" ? themes.nightOwl : themes.github}
        code={code}
        language={language}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 text-sm font-mono leading-relaxed overflow-x-auto"
            style={{
              margin: "0",
              background: "transparent",
            }}
          >
            <code className="block min-w-full">
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={i}
                    {...lineProps}
                    className={`table-row ${lineProps.className || ""}`}
                  >
                    <span className="table-cell select-none text-right pr-4 w-8 text-slate-300 text-xs">
                      {i + 1}
                    </span>
                    <span className="table-cell whitespace-pre">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
