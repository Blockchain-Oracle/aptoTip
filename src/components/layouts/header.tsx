'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Menu, 
  Search, 
  User, 
  Bell, 
  Store, 
  Palette, 
  QrCode, 
  Users, 
  TrendingUp,
  Camera,
  Music,
  Video,
  Settings,
  BarChart3,
  Gift,
  Utensils,
  Coffee,
  Car,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ROUTES } from '@/lib/constants'
import { NetworkIndicator } from '@/components/ui/network-switcher'

interface HeaderProps {
  variant?: 'marketing' | 'public' | 'dashboard'
  showSearch?: boolean
  user?: {
    name: string
    avatar?: string
    email: string
    type?: 'restaurant' | 'creator'
  } | null
}

export function Header({ variant = 'marketing', showSearch = false, user = null }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Network Indicator */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TipLink
              </span>
            </Link>
            
            {/* Network Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <NetworkIndicator />
            </motion.div>
          </motion.div>

          {/* Search Bar (Public variant) */}
          {showSearch && (
            <motion.div 
              className="flex-1 max-w-md mx-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search restaurants or creators..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div 
            className="flex items-center space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {variant === 'marketing' && (
              <>
                <div className="hidden md:flex">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                          For Restaurants
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                                  href={ROUTES.RESTAURANTS.LIST}
                                >
                                  <Store className="h-6 w-6 text-blue-600" />
                                  <div className="mb-2 mt-4 text-lg font-medium text-blue-900">
                                    Restaurant Directory
                                  </div>
                                  <p className="text-sm leading-tight text-blue-700">
                                    Discover restaurants using TipLink
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <ListItem href={ROUTES.RESTAURANTS.LIST} title="Browse Restaurants" icon={<Store className="w-4 h-4" />}>
                              Discover restaurants using TipLink
                            </ListItem>
                            <ListItem href={ROUTES.RESTAURANTS.CATEGORY('Pizza')} title="Pizza & Italian" icon={<Utensils className="w-4 h-4" />}>
                              Authentic pizza and Italian cuisine
                            </ListItem>
                            <ListItem href={ROUTES.RESTAURANTS.CATEGORY('Sushi')} title="Sushi & Japanese" icon={<Coffee className="w-4 h-4" />}>
                              Premium sushi and Japanese dining
                            </ListItem>
                            <ListItem href={ROUTES.CREATE.RESTAURANT} title="Create Restaurant Profile" icon={<Sparkles className="w-4 h-4" />}>
                              Start accepting tips instantly
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                          For Creators
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-50 to-purple-100 p-6 no-underline outline-none focus:shadow-md"
                                  href={ROUTES.CREATORS.LIST}
                                >
                                  <Palette className="h-6 w-6 text-purple-600" />
                                  <div className="mb-2 mt-4 text-lg font-medium text-purple-900">
                                    Creator Directory
                                  </div>
                                  <p className="text-sm leading-tight text-purple-700">
                                    Support amazing creators
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <ListItem href={ROUTES.CREATORS.LIST} title="Discover Creators" icon={<Palette className="w-4 h-4" />}>
                              Support amazing creators
                            </ListItem>
                            <ListItem href={ROUTES.CREATORS.CATEGORY('Music')} title="Musicians" icon={<Music className="w-4 h-4" />}>
                              Music creators and composers
                            </ListItem>
                            <ListItem href={ROUTES.CREATORS.CATEGORY('Art')} title="Digital Artists" icon={<Palette className="w-4 h-4" />}>
                              Digital artists and illustrators
                            </ListItem>
                            <ListItem href={ROUTES.CREATE.CREATOR} title="Create Creator Profile" icon={<Sparkles className="w-4 h-4" />}>
                              Start earning from your creativity
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                
                {!user ? (
                  <div className="flex items-center space-x-4 ml-4">
                    <Button asChild variant="outline">
                      <Link href={ROUTES.CREATE.RESTAURANT}>Create Restaurant Profile</Link>
                    </Button>
                    <Button asChild>
                      <Link href={ROUTES.CREATE.CREATOR}>Create Creator Profile</Link>
                    </Button>
                  </div>
                ) : (
                  <UserMenu user={user} />
                )}
              </>
            )}

            {variant === 'public' && (
              <>
                <div className="hidden md:flex">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                          Restaurants
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2">
                            <ListItem href={ROUTES.RESTAURANTS.LIST} title="All Restaurants" icon={<Store className="w-4 h-4" />}>
                              Browse all restaurants
                            </ListItem>
                            <ListItem href={ROUTES.RESTAURANTS.CATEGORY('Pizza')} title="Pizza & Italian" icon={<Utensils className="w-4 h-4" />}>
                              Authentic pizza and Italian cuisine
                            </ListItem>
                            <ListItem href={ROUTES.RESTAURANTS.CATEGORY('Sushi')} title="Sushi & Japanese" icon={<Coffee className="w-4 h-4" />}>
                              Premium sushi and Japanese dining
                            </ListItem>
                            <ListItem href={ROUTES.RESTAURANTS.CATEGORY('Healthy')} title="Healthy & Organic" icon={<Coffee className="w-4 h-4" />}>
                              Healthy and organic options
                            </ListItem>
                            <ListItem href={ROUTES.CREATE.RESTAURANT} title="Create Profile" icon={<Sparkles className="w-4 h-4" />}>
                              Start accepting tips
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                          Creators
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2">
                            <ListItem href={ROUTES.CREATORS.LIST} title="All Creators" icon={<Palette className="w-4 h-4" />}>
                              Discover all creators
                            </ListItem>
                            <ListItem href={ROUTES.CREATORS.CATEGORY('Music')} title="Music" icon={<Music className="w-4 h-4" />}>
                              Musicians and composers
                            </ListItem>
                            <ListItem href={ROUTES.CREATORS.CATEGORY('Art')} title="Digital Art" icon={<Palette className="w-4 h-4" />}>
                              Digital artists and illustrators
                            </ListItem>
                            <ListItem href={ROUTES.CREATORS.CATEGORY('Gaming')} title="Gaming" icon={<Video className="w-4 h-4" />}>
                              Streamers and gaming creators
                            </ListItem>
                            <ListItem href={ROUTES.CREATE.CREATOR} title="Create Profile" icon={<Sparkles className="w-4 h-4" />}>
                              Start earning from creativity
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button asChild variant="outline">
                    <Link href={ROUTES.CREATE.RESTAURANT}>Create Restaurant Profile</Link>
                  </Button>
                  <Button asChild>
                    <Link href={ROUTES.CREATE.CREATOR}>Create Creator Profile</Link>
                  </Button>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

function UserMenu({ user }: { user: { name: string; avatar?: string; email: string; type?: 'restaurant' | 'creator' } }) {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </Button>
      
      <div className="flex items-center space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
      </div>
    </div>
  )
}

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { 
  href: string; 
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center space-x-2 text-sm font-medium leading-none">
            {icon}
            <span>{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
} 