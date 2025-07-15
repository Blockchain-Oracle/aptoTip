import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function CreatorsLoading() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-[520px] mx-auto" />
      </div>

      {/* Filters Skeleton */}
      <div className="mb-8 space-y-4">
        {/* Search Bar Skeleton */}
        <div className="max-w-md mx-auto">
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Category Filters Skeleton */}
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>

        {/* View Toggle Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="h-48 w-full" />
              {/* Avatar skeleton overlay */}
              <div className="absolute bottom-4 left-4">
                <Skeleton className="w-12 h-12 rounded-full border-2 border-white" />
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-5 w-14" />
              </div>
              
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-24" />
                <div className="flex space-x-1">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
