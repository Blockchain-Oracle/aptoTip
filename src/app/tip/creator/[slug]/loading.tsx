import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreatorTipLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            {/* Creator Details Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-6 w-16 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-5 w-16" />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Skeleton className="h-8 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-16 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-8 mx-auto mb-1" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                      <Skeleton className="w-5 h-5" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Tips Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tip Form Skeleton */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
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
                  <Skeleton className="h-4 w-36 mb-2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>

                {/* Creator Impact Skeleton */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>

                {/* Summary Skeleton */}
                <div className="p-4 bg-white rounded-lg border border-purple-200">
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
