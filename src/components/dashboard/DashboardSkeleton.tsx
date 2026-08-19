import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-56" />
      </div>

      <Card>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <Skeleton className="size-52 shrink-0 rounded-full" />
          <div className="w-full space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}
