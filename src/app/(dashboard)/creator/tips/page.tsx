'use client';

import { useState } from 'react';
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Download,
  Filter,
  Search,
  Calendar
} from 'lucide-react';

interface TipData {
  id: string;
  amount: number;
  supporter: string;
  message: string;
  timestamp: string;
  isAnonymous: boolean;
  platform: string;
}

export default function CreatorTipsPage() {
  const [tips] = useState<TipData[]>([
    {
      id: 'tip_001',
      amount: 25.00,
      supporter: 'ArtLover_92',
      message: 'Your latest piece is absolutely stunning! Keep creating! 🎨',
      timestamp: '3 minutes ago',
      isAnonymous: false,
      platform: 'TipLink'
    },
    {
      id: 'tip_002',
      amount: 10.00,
      supporter: 'Anonymous',
      message: 'Love your work, thank you for sharing your talent!',
      timestamp: '12 minutes ago',
      isAnonymous: true,
      platform: 'TipLink'
    },
    {
      id: 'tip_003',
      amount: 15.00,
      supporter: 'Creative_Soul',
      message: 'This inspired me to start my own art journey 💕',
      timestamp: '28 minutes ago',
      isAnonymous: false,
      platform: 'TipLink'
    },
    {
      id: 'tip_004',
      amount: 50.00,
      supporter: 'BigFan_Art',
      message: 'Your work deserves more recognition. Here\'s to your success!',
      timestamp: '1 hour ago',
      isAnonymous: false,
      platform: 'TipLink'
    },
    {
      id: 'tip_005',
      amount: 5.00,
      supporter: 'NewFan',
      message: 'Just discovered your work, amazing!',
      timestamp: '2 hours ago',
      isAnonymous: false,
      platform: 'TipLink'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const avgTip = totalTips / tips.length;
  const uniqueSupporters = new Set(tips.filter(tip => !tip.isAnonymous).map(tip => tip.supporter)).size;

  const filteredTips = tips.filter(tip => 
    tip.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.supporter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fan Support</h1>
          <p className="text-gray-600 mt-1">Track and manage support from your fans</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Support</p>
              <p className="text-2xl font-bold text-gray-900">${totalTips.toFixed(2)}</p>
              <p className="text-green-600 text-sm font-medium">+18.5% this month</p>
            </div>
            <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Support</p>
              <p className="text-2xl font-bold text-gray-900">${avgTip.toFixed(2)}</p>
              <p className="text-blue-600 text-sm font-medium">Per contribution</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Supporters</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueSupporters}</p>
              <p className="text-purple-600 text-sm font-medium">Unique fans</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{tips.length}</p>
              <p className="text-orange-600 text-sm font-medium">Total tips</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search support messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Tips List */}
        <div className="space-y-4">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-bold text-gray-900">${tip.amount.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{tip.timestamp}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">via {tip.platform}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{tip.message}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>From: {tip.isAnonymous ? 'Anonymous Supporter' : tip.supporter}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No support found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
} 