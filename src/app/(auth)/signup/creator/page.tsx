'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Heart, 
  Instagram, 
  Twitter, 
  Youtube, 
  Chrome, 
  Loader2, 
  ArrowRight,
  Check,
  Globe,
  Music,
  Palette,
  Gamepad2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { CREATOR_CATEGORIES } from '@/lib/constants'

// Form schema
const creatorSchema = z.object({
  name: z.string().min(2, 'Creator name must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
})

type CreatorFormData = z.infer<typeof creatorSchema>

const categoryIcons = {
  music: Music,
  art: Palette,
  gaming: Gamepad2,
  education: Globe,
  comedy: Heart,
  cooking: Globe,
  fitness: Globe,
  tech: Globe,
  lifestyle: Globe,
  other: Globe,
}

export default function CreatorSignupPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<CreatorFormData>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: '',
      bio: '',
      category: '',
      instagram: '',
      twitter: '',
      youtube: '',
      website: '',
    },
  })

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    // TODO: Implement Google OAuth + creator profile creation
    console.log('Google creator signup clicked')
    setTimeout(() => setIsGoogleLoading(false), 2000) // Mock loading
  }

  const onSubmit = (data: CreatorFormData) => {
    console.log('Creator form submitted:', data)
    // TODO: Implement creator profile creation
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Creator Setup
        </h1>
        <p className="text-gray-600">
          Build your creator profile and start receiving tips
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i + 1 <= currentStep 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-8 h-0.5 mx-2 transition-colors ${
                i + 1 < currentStep ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Quick Google Signup */}
      {currentStep === 1 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Start with Google</h3>
            <p className="text-gray-600">
              Sign in with Google to create your keyless account
            </p>
          </div>

          <Button
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            variant="outline"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <Chrome className="w-5 h-5 mr-3 text-purple-600" />
            )}
            <span className="font-medium">
              {isGoogleLoading ? 'Setting up account...' : 'Continue with Google'}
            </span>
          </Button>

          <div className="flex justify-end">
            <Button onClick={nextStep} variant="ghost">
              Skip for now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Creator Details */}
      {currentStep === 2 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Creator Details</h3>
            <p className="text-gray-600">
              Tell your fans about yourself
            </p>
          </div>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creator Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alice Music" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="What type of content do you create?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CREATOR_CATEGORIES.map((category) => {
                          const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
                          return (
                            <SelectItem key={category} value={category}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className="w-4 h-4" />
                                <span>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell your fans about yourself, what you create, and why they should support you..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>

          <div className="flex justify-between">
            <Button onClick={prevStep} variant="outline">
              Back
            </Button>
            <Button onClick={nextStep}>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Social Links */}
      {currentStep === 3 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Connect Your Socials</h3>
            <p className="text-gray-600">
              Help fans find you across platforms
            </p>
          </div>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Instagram className="w-4 h-4 inline mr-2 text-pink-600" />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                        <Input 
                          placeholder="username" 
                          className="pl-8"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Twitter className="w-4 h-4 inline mr-2 text-blue-600" />
                      Twitter/X
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                        <Input 
                          placeholder="username" 
                          className="pl-8"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Youtube className="w-4 h-4 inline mr-2 text-red-600" />
                      YouTube
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">youtube.com/</span>
                        <Input 
                          placeholder="channel" 
                          className="pl-24"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Globe className="w-4 h-4 inline mr-2 text-green-600" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>

          <div className="flex justify-between">
            <Button onClick={prevStep} variant="outline">
              Back
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} className="bg-purple-600 hover:bg-purple-700">
              Create Creator Profile
            </Button>
          </div>
        </motion.div>
      )}

      {/* Benefits Footer */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-purple-600 font-bold">98%</div>
            <div className="text-gray-600">You Keep</div>
          </div>
          <div>
            <div className="text-green-600 font-bold">0%</div>
            <div className="text-gray-600">Gas Fees</div>
          </div>
          <div>
            <div className="text-blue-600 font-bold">1s</div>
            <div className="text-gray-600">Tip Processing</div>
          </div>
        </div>
      </motion.div>

      {/* Sign in link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
