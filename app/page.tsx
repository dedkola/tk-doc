import { Card, CardHeader, CardDescription } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home | ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <h1 className="flex items-center justify-center gap-3 mb-8">
          <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Getting Started with
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-base tracking-tight">
                TK
              </span>
            </span>
            <span className="font-bold text-4xl tracking-tight text-slate-900 dark:text-slate-100">
              Docs
            </span>
          </span>
        </h1>
        <Card className="w-full">
          <CardHeader className="text-center">
            {/* <CardTitle className="text-4xl">Welcome</CardTitle> */}
            <CardDescription className="text-xl mt-4">
              Select a topic from the sidebar to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
