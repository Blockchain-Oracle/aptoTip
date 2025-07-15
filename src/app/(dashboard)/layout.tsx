'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCreator = pathname.includes('/creator');
  const isRestaurant = pathname.includes('/restaurant');

  // Simple navigation items with emoji icons
  const creatorNav = [
    { name: 'Dashboard', href: '/creator', icon: '🏠' },
    { name: 'Profile', href: '/creator/profile', icon: '👤' },
    { name: 'Tips', href: '/creator/tips', icon: '💰' },
  ];

  const restaurantNav = [
    { name: 'Dashboard', href: '/restaurant', icon: '🏠' },
    { name: 'Profile', href: '/restaurant/profile', icon: '👤' },
    { name: 'Media', href: '/restaurant/media', icon: '📸' },
    { name: 'Tips', href: '/restaurant/tips', icon: '💰' },
  ];

  const navigation = isCreator ? creatorNav : restaurantNav;
  const userType = isCreator ? 'Creator' : 'Restaurant';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">{userType} Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">TipLink</p>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Simple Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome back! 👋
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
