import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TipLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div>
                <Skeleton className="h-6 w-48 mb-1" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            {/* Restaurant Details Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-18" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Map Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-[200px] rounded-lg" />
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tip Form Skeleton */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center">
                <Skeleton className="h-8 w-64 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Quick Tip Amounts Skeleton */}
                <div>
                  <Skeleton className="h-4 w-24 mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                </div>

                {/* Custom Amount Skeleton */}
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>

                {/* Message Skeleton */}
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>

                {/* Summary Skeleton */}
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-40 mt-1" />
                </div>

                {/* Button Skeleton */}
                <Skeleton className="w-full h-14" />

                {/* Security Note Skeleton */}
                <Skeleton className="h-3 w-64 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
