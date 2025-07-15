import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreatorLoading() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Hero Section Skeleton */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <Skeleton className="w-full h-full" />
        
        {/* Hero Content Skeleton */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end space-x-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Skeleton className="h-12 w-64" />
                  <Skeleton className="h-6 w-20" />
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tips Section Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="w-10 h-10 rounded-full" />
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tip Card Skeleton */}
          <Card>
            <CardHeader className="text-center">
              <Skeleton className="h-6 w-40 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Skeleton className="h-8 w-24 mx-auto mb-1" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
              
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Social Links Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
                <div>
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
              </div>
              
              <div className="text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
