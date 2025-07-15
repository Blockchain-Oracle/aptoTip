'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Utensils, Palette, ArrowRight } from 'lucide-react';

// Mock user data - in real app this would come from auth/database
interface UserProfile {
  id: string;
  type: 'restaurant' | 'creator' | null;
  name: string;
  email: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user profile
    const fetchUserProfile = async () => {
      try {
        // In real app, this would be an API call
        // For demo, we'll show the selection interface
        setTimeout(() => {
          setUser({
            id: '1',
            type: null, // User hasn't selected type yet
            name: 'Demo User',
            email: 'demo@tiplink.com'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDashboardSelect = (type: 'restaurant' | 'creator') => {
    // In real app, this would update the user's profile in the database
    setUser(prev => prev ? { ...prev, type } : null);
    
    // Navigate to the selected dashboard
    router.push(`/${type}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.type) {
    // User has already selected a type, redirect them
    useEffect(() => {
      router.push(`/${user.type}`);
    }, [user.type, router]);
    
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to TipLink, {user?.name}! 👋
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your dashboard type to get started with seamless tipping and engagement.
        </p>
      </div>

      {/* Dashboard Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Restaurant Dashboard */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
             onClick={() => handleDashboardSelect('restaurant')}>
          <div className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <Utensils className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Dashboard</h3>
            <p className="text-gray-600 mb-6">
              Perfect for restaurants, cafes, and food establishments. Generate QR codes for tables, 
              track customer tips, and manage your location-based tipping experience.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Generate QR codes for tables
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Track real-time tips and analytics
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Manage customer engagement
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Location-based verification
              </div>
            </div>
            <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
              <span>Choose Restaurant</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Creator Dashboard */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
             onClick={() => handleDashboardSelect('creator')}>
          <div className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
              <Palette className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Creator Dashboard</h3>
            <p className="text-gray-600 mb-6">
              Designed for content creators, artists, and influencers. Build your portfolio, 
              engage with fans, and receive direct support from your community.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                Showcase your portfolio
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                Engage with your fanbase
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                Receive direct fan support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                Share across social platforms
              </div>
            </div>
            <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
              <span>Choose Creator</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Powered by Aptos Blockchain</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Experience the future of tipping with keyless accounts, sponsored transactions, 
            and real-time payments. No crypto knowledge required!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Keyless Accounts</h3>
            <p className="text-sm text-gray-600">Sign in with Google - no wallet needed</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Zero Gas Fees</h3>
            <p className="text-sm text-gray-600">Sponsored transactions for seamless UX</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Payments</h3>
            <p className="text-sm text-gray-600">Sub-second finality on Aptos</p>
          </div>
        </div>
      </div>
    </div>
  );
} 