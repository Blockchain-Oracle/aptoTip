'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Download,
  Search,
  Eye,
  MessageCircle,
  Users,
  Clock,
  Star
} from 'lucide-react';

interface TipData {
  id: string;
  amount: number;
  tipper: string;
  message: string;
  timestamp: string;
  table: string;
  isAnonymous: boolean;
  rating?: number;
  paymentMethod: 'aptos' | 'card' | 'crypto';
}

export default function RestaurantTipsPage() {
  const [tips] = useState<TipData[]>([
    {
      id: 'tip_001',
      amount: 15.00,
      tipper: 'Anonymous',
      message: 'Great service! Food was amazing 😊',
      timestamp: '2024-01-15 18:30',
      table: 'Table 5',
      isAnonymous: true,
      rating: 5,
      paymentMethod: 'aptos'
    },
    {
      id: 'tip_002',
      amount: 8.50,
      tipper: 'John D.',
      message: 'Thank you for the wonderful evening!',
      timestamp: '2024-01-15 17:45',
      table: 'Table 2',
      isAnonymous: false,
      rating: 4,
      paymentMethod: 'aptos'
    },
    // Add more mock data...
  ]);

  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const avgTip = totalTips / tips.length;
  const totalTippers = new Set(tips.map(tip => tip.tipper)).size;
  const avgRating = tips.filter(tip => tip.rating).reduce((sum, tip) => sum + (tip.rating || 0), 0) / tips.filter(tip => tip.rating).length;

  const filteredTips = tips.filter(tip => 
    tip.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.tipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tips Received</h1>
          <p className="text-gray-600 mt-1">Track and manage all tips from customers</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tips</p>
              <p className="text-2xl font-bold text-gray-900">${totalTips.toFixed(2)}</p>
              <p className="text-green-600 text-sm font-medium">+12.5% today</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Tip</p>
              <p className="text-2xl font-bold text-gray-900">${avgTip.toFixed(2)}</p>
              <p className="text-blue-600 text-sm font-medium">Per customer</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tippers</p>
              <p className="text-2xl font-bold text-gray-900">{totalTippers}</p>
              <p className="text-purple-600 text-sm font-medium">Unique customers</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Rating</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-orange-600 text-sm font-medium">Customer satisfaction</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
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
                placeholder="Search tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Tips List */}
        <div className="space-y-4">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-bold text-gray-900">${tip.amount.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{tip.table}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{tip.timestamp}</span>
                    {tip.rating && (
                      <>
                        <span className="text-sm text-gray-500">•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{tip.rating}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {tip.message && (
                    <p className="text-gray-700 mb-2">{tip.message}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>From: {tip.isAnonymous ? 'Anonymous' : tip.tipper}</span>
                    <span>•</span>
                    <span className="capitalize">Via {tip.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                {tip.message && (
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tips found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
} 