'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, QrCode, Heart, Sparkles, Zap, Users, Shield, Globe, Award } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layouts/header'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Ripple } from '@/components/magicui/ripple'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { OrbitingCircles } from '@/components/magicui/orbiting-circles'

import { ANIMATIONS } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Header variant="marketing" />

      {/* Aptos Hackathon Banner */}
      <motion.div
        className="relative z-40 px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-white">
            <Award className="w-5 h-5" />
            <span className="font-semibold">🏆 Built for Aptos Hackathon 2024</span>
            <span className="hidden md:inline">• Showcasing Keyless Accounts & Sponsored Transactions</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  Powered by Aptos Blockchain
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Tip Anyone
                </span>
                <br />
                <span className="text-gray-900">
                  with just Google
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Revolutionary tipping for restaurants and creators. 
                <br className="hidden md:block" />
                No crypto knowledge required. Zero friction. Instant payments.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ShimmerButton asChild>
                <Link href="/signup/restaurant" className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Start as Restaurant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </ShimmerButton>
              
              <Button asChild size="lg" variant="outline" className="group">
                <Link href="/signup/creator" className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
                  <span>Start as Creator</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  <NumberTicker value={0} />%
                </div>
                <div className="text-sm text-gray-600">Gas Fees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  <NumberTicker value={2} />%
                </div>
                <div className="text-sm text-gray-600">Platform Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  <NumberTicker value={1} />s
                </div>
                <div className="text-sm text-gray-600">Confirmation</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <Ripple />
        </div>
        
        {/* Orbiting Elements */}
        <div className="absolute top-20 right-20 hidden lg:block">
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            duration={20}
            delay={20}
            radius={80}
          >
            <QrCode className="w-6 h-6 text-blue-500" />
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            duration={20}
            delay={10}
            radius={80}
          >
            <Heart className="w-6 h-6 text-purple-500" />
          </OrbitingCircles>
        </div>
      </section>

      {/* Aptos Features Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on <span className="text-yellow-300">Aptos Blockchain</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Showcasing the latest Aptos features that make Web3 accessible to everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-green-300" />,
                title: "Keyless Accounts",
                description: "Sign in with Google OAuth only - no wallet installation required"
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-300" />,
                title: "Sponsored Transactions",
                description: "Zero gas fees for users - we sponsor all blockchain interactions"
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-300" />,
                title: "Sub-second Finality",
                description: "Instant transaction confirmations with Aptos consensus"
              },
              {
                icon: <Heart className="w-8 h-8 text-pink-300" />,
                title: "Move Smart Contracts",
                description: "Resource-oriented programming for maximum security"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Two Ways to <span className="text-blue-600">Tip</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're supporting local businesses or favorite creators, 
              tipping has never been this simple.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Restaurant Flow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Restaurant Tipping</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold">Scan QR Code</h4>
                        <p className="text-gray-600">Simply scan the QR code at your restaurant table</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold">Sign in with Google</h4>
                        <p className="text-gray-600">One-click authentication, no wallet needed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold">Send Tip</h4>
                        <p className="text-gray-600">Choose amount and send instantly</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Creator Flow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Creator Support</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold">Visit Profile</h4>
                        <p className="text-gray-600">Click the creator's TipLink from social media</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold">Quick Sign-in</h4>
                        <p className="text-gray-600">Google OAuth in seconds</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold">Support Creator</h4>
                        <p className="text-gray-600">Direct payment, 98% goes to creator</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="text-purple-600">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No crypto knowledge required. Just the simplicity you expect 
              from modern payment apps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                title: "Instant Payments",
                description: "Sub-second transaction finality with Aptos blockchain technology"
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: "Secure & Trusted",
                description: "Google OAuth authentication with blockchain-level security"
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Universal Access",
                description: "Works for anyone with a Google account - no wallet needed"
              },
              {
                icon: <Globe className="w-8 h-8 text-purple-600" />,
                title: "Zero Gas Fees",
                description: "Sponsored transactions mean users never pay gas fees"
              },
              {
                icon: <Heart className="w-8 h-8 text-pink-600" />,
                title: "Direct Support",
                description: "98% of tips go directly to restaurants and creators"
              },
              {
                icon: <QrCode className="w-8 h-8 text-indigo-600" />,
                title: "QR Integration",
                description: "Seamless physical-to-digital experience for restaurants"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-yellow-300" />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Aptos Hackathon 2024
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Tipping?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the future of payments with Aptos blockchain technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">TipLink</span>
              </div>
              <p className="text-gray-400 mb-4">
                Making tipping as easy as signing into Google.
              </p>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">Built for Aptos Hackathon 2024</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Restaurants</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/signup/restaurant" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/features/qr-codes" className="hover:text-white transition-colors">QR Codes</Link></li>
                <li><Link href="/features/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Creators</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/signup/creator" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/features/profiles" className="hover:text-white transition-colors">Profile Pages</Link></li>
                <li><Link href="/features/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TipLink. Built for Aptos Hackathon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
