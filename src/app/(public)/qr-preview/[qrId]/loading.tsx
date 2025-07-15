import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function QRPreviewLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-16" />
          <div className="text-center">
            <Skeleton className="h-8 w-48 mb-1 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <div className="w-16" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - QR Code Skeleton */}
          <div className="space-y-6">
            {/* QR Code Display Skeleton */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center">
                <Skeleton className="h-6 w-40 mx-auto" />
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* QR Code Skeleton */}
                <div className="flex justify-center p-8 bg-white rounded-lg">
                  <Skeleton className="w-[300px] h-[300px] rounded-lg" />
                </div>

                {/* QR Code Info Skeleton */}
                <div className="text-center p-4 bg-white rounded-lg">
                  <Skeleton className="h-6 w-32 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto mb-2" />
                  <Skeleton className="h-5 w-24 mx-auto" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
              </CardContent>
            </Card>

            {/* Instructions Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-28" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics Skeleton */}
          <div className="space-y-6">
            {/* Quick Stats Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                      <Skeleton className="h-8 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Info Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-40 mb-2" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Tips Skeleton */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 