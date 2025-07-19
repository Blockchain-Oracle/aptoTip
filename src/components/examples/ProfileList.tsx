'use client';

import { useProfiles, useRestaurants, useCreators, isRestaurant, isCreator } from '@/hooks/useProfiles';
import { useTips } from '@/hooks/useTips';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SendTipButton, CreateProfileButton } from '@/components/blockchain/ActionButtons';
import { useState } from 'react';

export function ProfileList() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'restaurant' | 'creator'>('all');
  
  // Use the new hooks
  const { data: allProfiles, isLoading: isLoadingAll, error: errorAll } = useProfiles();
  const { data: restaurants, isLoading: isLoadingRestaurants } = useRestaurants();
  const { data: creators, isLoading: isLoadingCreators } = useCreators();
  
  // Determine which data to show
  const profiles = selectedCategory === 'restaurant' ? restaurants : 
                   selectedCategory === 'creator' ? creators : 
                   allProfiles;
  
  const isLoading = selectedCategory === 'restaurant' ? isLoadingRestaurants :
                    selectedCategory === 'creator' ? isLoadingCreators :
                    isLoadingAll;
  
  const error = errorAll;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading profiles: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        <Button
          variant={selectedCategory === 'restaurant' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('restaurant')}
        >
          Restaurants
        </Button>
        <Button
          variant={selectedCategory === 'creator' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('creator')}
        >
          Creators
        </Button>
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles?.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {profiles?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No profiles found</p>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ profile }: { profile: any }) {
  const { data: tips } = useTips(profile.id);
  const queryClient = useQueryClient();

  const handleTipSuccess = (hash: string) => {
    console.log('Tip sent successfully:', hash);
    
    // Invalidate and refetch profile data to show updated tip counts
    queryClient.invalidateQueries({ queryKey: ['profiles'] });
    queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
    queryClient.invalidateQueries({ queryKey: ['tips', profile.id] });
    
    // You can add toast notification here
  };

  console.log('🎯 ProfileCard: Rendering profile:', { 
    id: profile.id, 
    name: profile.name, 
    walletAddress: profile.walletAddress,
    totalTips: profile.totalTips,
    tipCount: profile.tipCount
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{profile.name}</CardTitle>
            <CardDescription>
              {isRestaurant(profile) ? `${profile.city}, ${profile.state}` : `${profile.followers} followers`}
            </CardDescription>
          </div>
          {profile.verified && (
            <Badge variant="secondary">Verified</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{profile.bio}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm">
            <span className="font-medium">${(profile.totalTips / 100).toFixed(2)}</span>
            <span className="text-gray-500"> total tips</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{profile.tipCount}</span>
            <span className="text-gray-500"> tips</span>
          </div>
        </div>

        {isRestaurant(profile) && profile.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Use the new SendTipButton component with profileId */}
        <SendTipButton
          recipientAddress={profile.walletAddress}
          profileId={profile.id} // Pass the profileId for database sync
          amount={5.00}
          message="Great work! 🎉"
          onSuccess={handleTipSuccess}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
} 