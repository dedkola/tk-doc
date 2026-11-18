"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;

    let success = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(code);
        success = true;
      } catch {
        // Fall through to the legacy copy path.
      }
    }

    if (!success) {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      success = document.execCommand("copy");
      textArea.remove();
    }

    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
  );
}
