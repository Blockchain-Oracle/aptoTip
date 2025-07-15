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
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
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
                                  href="/restaurants"
                                >
                                  <Store className="h-6 w-6 text-blue-600" />
                                  <div className="mb-2 mt-4 text-lg font-medium text-blue-900">
                                    Restaurant Solutions
                                  </div>
                                  <p className="text-sm leading-tight text-blue-700">
                                    QR codes, tip management, and customer engagement
                                  </p>
                </Link>
                              </NavigationMenuLink>
                            </li>
                            <ListItem href="/restaurants" title="Browse Restaurants" icon={<Store className="w-4 h-4" />}>
                              Discover restaurants using TipLink
                            </ListItem>
                            <ListItem href="/restaurants/category/fine-dining" title="Fine Dining" icon={<Utensils className="w-4 h-4" />}>
                              Upscale restaurants and experiences
                            </ListItem>
                            <ListItem href="/restaurants/category/casual-dining" title="Casual Dining" icon={<Coffee className="w-4 h-4" />}>
                              Family-friendly dining options
                            </ListItem>
                            <ListItem href="/signup/restaurant" title="Join as Restaurant" icon={<Sparkles className="w-4 h-4" />}>
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
                                  href="/creators"
                                >
                                  <Palette className="h-6 w-6 text-purple-600" />
                                  <div className="mb-2 mt-4 text-lg font-medium text-purple-900">
                                    Creator Platform
                                  </div>
                                  <p className="text-sm leading-tight text-purple-700">
                                    Showcase your work and receive support
                                  </p>
                </Link>
                              </NavigationMenuLink>
                            </li>
                            <ListItem href="/creators" title="Discover Creators" icon={<Palette className="w-4 h-4" />}>
                              Support amazing creators
                            </ListItem>
                            <ListItem href="/creators/category/art" title="Visual Artists" icon={<Palette className="w-4 h-4" />}>
                              Digital artists and illustrators
                            </ListItem>
                            <ListItem href="/creators/category/music" title="Musicians" icon={<Music className="w-4 h-4" />}>
                              Music creators and composers
                            </ListItem>
                            <ListItem href="/signup/creator" title="Join as Creator" icon={<Sparkles className="w-4 h-4" />}>
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
                    <Link href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Sign In
                    </Link>
                    <Button asChild>
                      <Link href="/signup">Get Started</Link>
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
                            <ListItem href="/restaurants" title="All Restaurants" icon={<Store className="w-4 h-4" />}>
                              Browse all restaurants
                            </ListItem>
                            <ListItem href="/restaurants/category/fine-dining" title="Fine Dining" icon={<Utensils className="w-4 h-4" />}>
                              Upscale dining experiences
                            </ListItem>
                            <ListItem href="/restaurants/category/casual-dining" title="Casual Dining" icon={<Coffee className="w-4 h-4" />}>
                              Family-friendly restaurants
                            </ListItem>
                            <ListItem href="/restaurants/category/cafe" title="Cafés" icon={<Coffee className="w-4 h-4" />}>
                              Coffee shops and light meals
                            </ListItem>
                            <ListItem href="/restaurants/category/fast-food" title="Fast Food" icon={<Car className="w-4 h-4" />}>
                              Quick service restaurants
                            </ListItem>
                            <ListItem href="/restaurants/category/bar" title="Bars" icon={<Coffee className="w-4 h-4" />}>
                              Drinks and bar food
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
                            <ListItem href="/creators" title="All Creators" icon={<Palette className="w-4 h-4" />}>
                              Discover all creators
                            </ListItem>
                            <ListItem href="/creators/category/art" title="Visual Art" icon={<Palette className="w-4 h-4" />}>
                              Digital artists and illustrators
                            </ListItem>
                            <ListItem href="/creators/category/music" title="Music" icon={<Music className="w-4 h-4" />}>
                              Musicians and composers
                            </ListItem>
                            <ListItem href="/creators/category/gaming" title="Gaming" icon={<Video className="w-4 h-4" />}>
                              Streamers and gaming creators
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                
                {!user ? (
                  <div className="flex items-center space-x-4 ml-4">
                    <Link href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Sign In
                    </Link>
                    <Button asChild size="sm">
                      <Link href="/signup">Join TipLink</Link>
                    </Button>
                  </div>
                ) : (
                  <UserMenu user={user} />
                )}
              </>
            )}

            {variant === 'dashboard' && user && (
              <>
                {/* Dashboard Search */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={user.type === 'restaurant' ? "Search tips, QR codes..." : "Search portfolio, fans..."}
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="hidden md:flex">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                          Manage
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[280px] gap-3 p-4">
                            {user.type === 'restaurant' ? (
                              <>
                                <ListItem href="/restaurant" title="Dashboard" icon={<BarChart3 className="w-4 h-4" />}>
                                  Overview and analytics
                                </ListItem>
                                <ListItem href="/restaurant/profile" title="Profile" icon={<Store className="w-4 h-4" />}>
                                  Restaurant information
                                </ListItem>
                                <ListItem href="/restaurant/qr-codes" title="QR Codes" icon={<QrCode className="w-4 h-4" />}>
                                  Manage table QR codes
                                </ListItem>
                                <ListItem href="/restaurant/media" title="Media Gallery" icon={<Camera className="w-4 h-4" />}>
                                  Photos and videos
                                </ListItem>
                                <ListItem href="/restaurant/tips" title="Tips Received" icon={<Gift className="w-4 h-4" />}>
                                  View all tips
                                </ListItem>
                                <ListItem href="/restaurant/settings" title="Settings" icon={<Settings className="w-4 h-4" />}>
                                  Account preferences
                                </ListItem>
                              </>
                            ) : (
                              <>
                                <ListItem href="/creator" title="Dashboard" icon={<BarChart3 className="w-4 h-4" />}>
                                  Overview and analytics
                                </ListItem>
                                <ListItem href="/creator/profile" title="Profile" icon={<User className="w-4 h-4" />}>
                                  Creator information
                                </ListItem>
                                <ListItem href="/creator/portfolio" title="Portfolio" icon={<Palette className="w-4 h-4" />}>
                                  Manage your content
                                </ListItem>
                                <ListItem href="/creator/tips" title="Fan Support" icon={<Heart className="w-4 h-4" />}>
                                  View received support
                                </ListItem>
                                <ListItem href="/creator/fans" title="Fans" icon={<Users className="w-4 h-4" />}>
                                  Fan community
                                </ListItem>
                                <ListItem href="/creator/settings" title="Settings" icon={<Settings className="w-4 h-4" />}>
                                  Account preferences
                                </ListItem>
                              </>
                            )}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                          Quick Actions
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[250px] gap-3 p-4">
                            {user.type === 'restaurant' ? (
                              <>
                                <ListItem href="/restaurant/qr-codes/create" title="Create QR Code" icon={<QrCode className="w-4 h-4" />}>
                                  Generate new table QR
                                </ListItem>
                                <ListItem href="/restaurant/media/upload" title="Upload Media" icon={<Camera className="w-4 h-4" />}>
                                  Add photos/videos
                                </ListItem>
                                <ListItem href="/restaurant/profile/edit" title="Edit Profile" icon={<Settings className="w-4 h-4" />}>
                                  Update information
                                </ListItem>
                              </>
                            ) : (
                              <>
                                <ListItem href="/creator/portfolio/upload" title="Upload Content" icon={<Palette className="w-4 h-4" />}>
                                  Add to portfolio
                                </ListItem>
                                <ListItem href="/creator/profile/edit" title="Edit Profile" icon={<Settings className="w-4 h-4" />}>
                                  Update information
                                </ListItem>
                                <ListItem href="/creator" title="Share Profile" icon={<Heart className="w-4 h-4" />}>
                                  Get your link
                                </ListItem>
                              </>
                            )}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="sr-only">3 unread notifications</span>
                </Button>
                <UserMenu user={user} />
              </>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

function UserMenu({ user }: { user: { name: string; avatar?: string; email: string; type?: 'restaurant' | 'creator' } }) {
  const dashboardPath = user.type === 'creator' ? '/creator' : '/restaurant'
  
  return (
    <div className="flex items-center space-x-3">
      <Link href={dashboardPath} className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors font-medium">
        Dashboard
      </Link>
      <Link href={dashboardPath} className="flex items-center space-x-2">
        <Avatar className="w-8 h-8 ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 transition-all">
        <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500 capitalize">{user.type}</div>
        </div>
      </Link>
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
          <div className="flex items-center space-x-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
} 