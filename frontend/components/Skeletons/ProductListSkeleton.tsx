import {Skeleton} from "@/components/ui/skeleton";

export default function ProductListSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <Skeleton className="mt-4 h-5 w-1/4" />
          </div>
        ))}
    </div>
  )
}