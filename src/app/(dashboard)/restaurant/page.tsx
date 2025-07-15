'use client';

import { useState } from 'react';
import { 
  QrCode, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  MapPin,
  Star,
  Download,
  Share,
  Eye
} from 'lucide-react';

interface TipData {
  id: string;
  amount: number;
  tipper: string;
  message: string;
  timestamp: string;
  table?: string;
}

interface QRCodeData {
  id: string;
  table: string;
  scans: number;
  lastUsed: string;
  isActive: boolean;
}

export default function RestaurantDashboard() {
  const [recentTips] = useState<TipData[]>([
    {
      id: '1',
      amount: 15.00,
      tipper: 'Anonymous',
      message: 'Great service! Food was amazing 😊',
      timestamp: '2 minutes ago',
      table: 'Table 5'
    },
    {
      id: '2',
      amount: 8.50,
      tipper: 'John D.',
      message: 'Thank you for the wonderful evening!',
      timestamp: '8 minutes ago',
      table: 'Table 2'
    },
    {
      id: '3',
      amount: 12.00,
      tipper: 'Sarah M.',
      message: 'Best pasta in town! 🍝',
      timestamp: '15 minutes ago',
      table: 'Table 7'
    },
    {
      id: '4',
      amount: 20.00,
      tipper: 'Mike R.',
      message: 'Exceptional service, will be back soon!',
      timestamp: '23 minutes ago',
      table: 'Table 1'
    }
  ]);

  const [qrCodes] = useState<QRCodeData[]>([
    { id: '1', table: 'Table 1', scans: 23, lastUsed: '2 min ago', isActive: true },
    { id: '2', table: 'Table 2', scans: 18, lastUsed: '8 min ago', isActive: true },
    { id: '3', table: 'Table 3', scans: 31, lastUsed: '12 min ago', isActive: true },
    { id: '4', table: 'Table 4', scans: 7, lastUsed: '1 hour ago', isActive: false },
    { id: '5', table: 'Table 5', scans: 45, lastUsed: '2 min ago', isActive: true },
  ]);

  const totalTipsToday = recentTips.reduce((sum, tip) => sum + tip.amount, 0);
  const activeTables = qrCodes.filter(qr => qr.isActive).length;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Tips</p>
              <p className="text-2xl font-bold text-gray-900">${totalTipsToday.toFixed(2)}</p>
              <p className="text-green-600 text-sm font-medium">+12.5% from yesterday</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Tables</p>
              <p className="text-2xl font-bold text-gray-900">{activeTables}</p>
              <p className="text-blue-600 text-sm font-medium">of {qrCodes.length} tables</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Tip Amount</p>
              <p className="text-2xl font-bold text-gray-900">${(totalTipsToday / recentTips.length).toFixed(2)}</p>
              <p className="text-purple-600 text-sm font-medium">+$1.20 from avg</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Customer Rating</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-orange-600 text-sm font-medium">Based on 127 reviews</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Tips</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTips.map((tip) => (
                <div key={tip.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">${tip.amount.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">{tip.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{tip.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>From: {tip.tipper}</span>
                      {tip.table && (
                        <>
                          <span>•</span>
                          <span>{tip.table}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Status</h3>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Generate New
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {qrCodes.map((qr) => (
                <div key={qr.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${qr.isActive ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{qr.table}</p>
                      <p className="text-xs text-gray-500">{qr.scans} scans • Last used {qr.lastUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Mario's Pizza</h3>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">123 Main Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Open until 10:00 PM</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
