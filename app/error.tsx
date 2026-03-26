"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (siteConfig.debug?.logErrors) {
      console.error("Error boundary caught:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Something went wrong!
        </h1>

        <p className="mb-6 text-slate-600 dark:text-slate-400">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>

        {siteConfig.debug?.showErrorDetails && error.message && (
          <div className="mb-6 rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-left">
            <p className="text-sm font-mono text-slate-800 dark:text-slate-200 wrap-break-word">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try again
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
