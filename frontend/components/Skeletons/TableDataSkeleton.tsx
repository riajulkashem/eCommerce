import {Skeleton} from "@/components/ui/skeleton";

export  default  function TableDataSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-5 sm:px-6">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}