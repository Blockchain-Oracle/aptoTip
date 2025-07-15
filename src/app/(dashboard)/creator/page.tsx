'use client';

import { useState } from 'react';
import { 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  Share,
  Upload,
  Play,
  Image,
  Music,
  Palette,
  ThumbsUp,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface SupportData {
  id: string;
  amount: number;
  supporter: string;
  message: string;
  timestamp: string;
  isAnonymous: boolean;
}

interface PortfolioItem {
  id: string;
  type: 'image' | 'video' | 'music' | 'art';
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  tips: number;
  uploadDate: string;
}

interface FanMetric {
  label: string;
  value: number;
  growth: string;
  icon: React.ComponentType<any>;
}

export default function CreatorDashboard() {
  const [recentSupport] = useState<SupportData[]>([
    {
      id: '1',
      amount: 25.00,
      supporter: 'ArtLover_92',
      message: 'Your latest piece is absolutely stunning! Keep creating! 🎨',
      timestamp: '3 minutes ago',
      isAnonymous: false
    },
    {
      id: '2',
      amount: 10.00,
      supporter: 'Anonymous',
      message: 'Love your work, thank you for sharing your talent!',
      timestamp: '12 minutes ago',
      isAnonymous: true
    },
    {
      id: '3',
      amount: 15.00,
      supporter: 'Creative_Soul',
      message: 'This inspired me to start my own art journey 💕',
      timestamp: '28 minutes ago',
      isAnonymous: false
    },
    {
      id: '4',
      amount: 50.00,
      supporter: 'BigFan_Art',
      message: 'Your work deserves more recognition. Here\'s to your success!',
      timestamp: '1 hour ago',
      isAnonymous: false
    }
  ]);

  const [portfolio] = useState<PortfolioItem[]>([
    {
      id: '1',
      type: 'art',
      title: 'Digital Sunset',
      thumbnail: '/api/placeholder/300/200',
      views: 1247,
      likes: 89,
      tips: 12,
      uploadDate: '2 days ago'
    },
    {
      id: '2',
      type: 'video',
      title: 'Speed Painting Process',
      thumbnail: '/api/placeholder/300/200',
      views: 2341,
      likes: 156,
      tips: 24,
      uploadDate: '5 days ago'
    },
    {
      id: '3',
      type: 'image',
      title: 'Portrait Study',
      thumbnail: '/api/placeholder/300/200',
      views: 892,
      likes: 67,
      tips: 8,
      uploadDate: '1 week ago'
    },
    {
      id: '4',
      type: 'music',
      title: 'Ambient Creation',
      thumbnail: '/api/placeholder/300/200',
      views: 534,
      likes: 43,
      tips: 6,
      uploadDate: '1 week ago'
    }
  ]);

  const [fanMetrics] = useState<FanMetric[]>([
    { label: 'Total Followers', value: 2847, growth: '+127 this week', icon: Users },
    { label: 'Monthly Views', value: 15420, growth: '+23% vs last month', icon: Eye },
    { label: 'Engagement Rate', value: 8.4, growth: '+1.2% improvement', icon: ThumbsUp },
    { label: 'Avg Support', value: 18.75, growth: '+$3.20 increase', icon: Heart }
  ]);

  const totalSupport = recentSupport.reduce((sum, support) => sum + support.amount, 0);
  const totalViews = portfolio.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = portfolio.reduce((sum, item) => sum + item.likes, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'art': return <Palette className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Recent Support</p>
              <p className="text-2xl font-bold text-gray-900">${totalSupport.toFixed(2)}</p>
              <p className="text-green-600 text-sm font-medium">+18.5% this week</p>
            </div>
            <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-blue-600 text-sm font-medium">+342 today</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
              <p className="text-purple-600 text-sm font-medium">+23 today</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Supporters</p>
              <p className="text-2xl font-bold text-gray-900">387</p>
              <p className="text-orange-600 text-sm font-medium">+12 this week</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Support */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Support</h3>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentSupport.map((support) => (
                  <div key={support.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-gray-900">${support.amount.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">{support.timestamp}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{support.message}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-purple-600">
                          From: {support.supporter}
                        </span>
                        {support.isAnonymous && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fan Metrics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fan Metrics</h3>
            <div className="space-y-4">
              {fanMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="font-semibold text-gray-900">
                        {metric.label.includes('Rate') ? `${metric.value}%` : 
                         metric.label.includes('Avg') ? `$${metric.value}` :
                         metric.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600">{metric.growth}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors">
                <Upload className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Upload New Content</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Share className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Share Profile</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Message Fans</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">Schedule Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Showcase */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Highlights</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View Full Portfolio
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video mb-3">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{item.views} views</span>
                        <span>•</span>
                        <span>{item.likes} likes</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{item.uploadDate}</span>
                  <span className="text-purple-600 font-medium">{item.tips} tips</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Creator Profile Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Alice Creative</h3>
              <p className="text-gray-600 mb-2">Digital Artist & Content Creator</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>2.8K followers</span>
                <span>•</span>
                <span>127 pieces</span>
                <span>•</span>
                <span>Member since 2023</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
