'use client'

import { Header } from '@/components/layouts/header'

interface PublicLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function PublicLayout({ children, modal }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="public" showSearch={true} />
      
      <main className="pb-16">
        {children}
      </main>
      
      {/* Modal parallel route */}
      {modal}
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">TipLink</h4>
              <p className="text-gray-600 text-sm mb-4">
                Making tipping as easy as signing into Google.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-blue-600 font-medium">Built for Aptos Hackathon 2024</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Discover</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/restaurants" className="hover:text-gray-900 transition-colors">Restaurants</a></li>
                <li><a href="/creators" className="hover:text-gray-900 transition-colors">Creators</a></li>
                <li><a href="/restaurants/category/fine-dining" className="hover:text-gray-900 transition-colors">Fine Dining</a></li>
                <li><a href="/creators/category/music" className="hover:text-gray-900 transition-colors">Musicians</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">For Business</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/signup/restaurant" className="hover:text-gray-900 transition-colors">Join as Restaurant</a></li>
                <li><a href="/signup/creator" className="hover:text-gray-900 transition-colors">Join as Creator</a></li>
                <li><a href="/help" className="hover:text-gray-900 transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/about" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a></li>
                <li><a href="/terms" className="hover:text-gray-900 transition-colors">Terms</a></li>
                <li><a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 TipLink. Built for Aptos Hackathon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
