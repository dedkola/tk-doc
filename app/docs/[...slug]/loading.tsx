import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex gap-8">
      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title */}
        <Skeleton className="h-10 w-3/4 mb-4" />

        {/* Description */}
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-2/3 mb-6" />

        {/* Tags */}
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Content paragraphs */}
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-5/6 mb-6" />

        {/* Code block */}
        <Skeleton className="h-48 w-full rounded-xl mb-6" />

        {/* More paragraphs */}
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-4/5 mb-3" />
        <Skeleton className="h-4 w-full mb-6" />

        {/* Another code block */}
        <Skeleton className="h-32 w-full rounded-xl mb-6" />
      </div>

      {/* Table of Contents sidebar */}
      <div className="hidden xl:block w-56 shrink-0">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3 pl-4 border-l border-border">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
