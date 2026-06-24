"use client";

import type { ReactNode } from "react";
import { useState, useCallback } from "react";

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

export function InlineCode({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    const text = getTextContent(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail if clipboard access is not available
    }
  }, [children]);

  return (
    <code
      onClick={handleClick}
      className={`rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground cursor-pointer transition-colors hover:bg-muted-foreground/20 ${
        copied ? "ring-2 ring-green-400/50" : ""
      }`}
      title="Click to copy"
    >
      {children}
    </code>
  );
}
