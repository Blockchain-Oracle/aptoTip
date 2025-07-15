'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, Grid3X3, List, Search, Filter, Trash2, Eye, Edit3 } from 'lucide-react';

export default function RestaurantMediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [media] = useState([
    { id: '1', name: 'Restaurant Interior', type: 'image', url: '/api/placeholder/300/200', uploadDate: '2024-01-15', size: '2.1 MB' },
    { id: '2', name: 'Pizza Special', type: 'image', url: '/api/placeholder/300/200', uploadDate: '2024-01-14', size: '1.8 MB' },
    { id: '3', name: 'Chef Portrait', type: 'image', url: '/api/placeholder/300/200', uploadDate: '2024-01-13', size: '2.4 MB' },
    { id: '4', name: 'Menu Board', type: 'image', url: '/api/placeholder/300/200', uploadDate: '2024-01-12', size: '1.5 MB' },
    { id: '5', name: 'Kitchen Tour', type: 'video', url: '/api/placeholder/300/200', uploadDate: '2024-01-11', size: '15.2 MB' },
    { id: '6', name: 'Outdoor Seating', type: 'image', url: '/api/placeholder/300/200', uploadDate: '2024-01-10', size: '2.8 MB' }
  ]);

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant photos and videos</p>
        </div>
        <Link
          href="/restaurant/media/upload"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{item.uploadDate}</span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMedia.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{item.type}</span>
                      <span>{item.uploadDate}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No media found</p>
          </div>
        )}
      </div>
    </div>
  );
}
