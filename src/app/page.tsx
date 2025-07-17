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
import { ROUTES } from '@/lib/constants'

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
                  Create Your Tipping Profile
                </span>
                <br />
                <span className="text-gray-900">
                  in 30 seconds
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Anyone can create a tipping profile with just their wallet address.
                <br className="hidden md:block" />
                No complex setup. No crypto knowledge required. Just Google sign-in to tip.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ShimmerButton asChild>
                <Link href={ROUTES.CREATE.RESTAURANT} className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Create Restaurant Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </ShimmerButton>
              
              <Button asChild size="lg" variant="outline" className="group">
                <Link href={ROUTES.CREATE.CREATOR} className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
                  <span>Create Creator Profile</span>
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
                  <NumberTicker value={30} />s
                </div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  <NumberTicker value={0} />%
                </div>
                <div className="text-sm text-gray-600">Gas Fees</div>
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

      {/* How It Works Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your profile, share your link, and start receiving tips instantly
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <QrCode className="w-8 h-8 text-blue-600" />,
                title: "Create Profile",
                description: "Input your wallet address and basic info. Upload your banner and profile images."
              },
              {
                step: "2", 
                icon: <Heart className="w-8 h-8 text-purple-600" />,
                title: "Share Your Link",
                description: "Get a unique URL like tiplink.com/restaurants/your-name to share anywhere."
              },
              {
                step: "3",
                icon: <Zap className="w-8 h-8 text-green-600" />,
                title: "Receive Tips",
                description: "Fans tip with Google sign-in. Money goes directly to your wallet instantly."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse Profiles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover restaurants and creators already using TipLink
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <QrCode className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Restaurants</h3>
                <p className="text-gray-600 mb-6">
                  Support your favorite local restaurants with instant tips
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href={ROUTES.RESTAURANTS.LIST}>
                    Browse Restaurants
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Creators</h3>
                <p className="text-gray-600 mb-6">
                  Support amazing creators and artists directly
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href={ROUTES.CREATORS.LIST}>
                    Browse Creators
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>
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

      {/* CTA Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create your tipping profile in 30 seconds and start receiving support instantly
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton asChild>
                <Link href={ROUTES.CREATE.RESTAURANT} className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Create Restaurant Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </ShimmerButton>
              
              <Button asChild size="lg" variant="outline" className="group">
                <Link href={ROUTES.CREATE.CREATOR} className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
                  <span>Create Creator Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
