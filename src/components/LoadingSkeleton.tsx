import { Skeleton } from '@/components/ui/skeleton';

export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-16 border-b bg-background/95">
      <div className="container mx-auto px-4 flex items-center h-full gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64 hidden md:block" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export const ArticleSkeleton = () => (
  <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-12 w-full" />
    <div className="flex gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-64 w-full rounded-xl" />
    {[1, 2, 3, 4, 5].map(i => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
  </div>
);

export default PageSkeleton;
