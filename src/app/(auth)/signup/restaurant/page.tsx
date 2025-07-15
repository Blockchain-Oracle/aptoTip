'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  QrCode, 
  MapPin, 
  Phone, 
  Globe, 
  Chrome, 
  Loader2, 
  ArrowRight,
  Check
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { RESTAURANT_CATEGORIES } from '@/lib/constants'

// Form schema
const restaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
})

type RestaurantFormData = z.infer<typeof restaurantSchema>

export default function RestaurantSignupPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      website: '',
    },
  })

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    // TODO: Implement Google OAuth + restaurant profile creation
    console.log('Google restaurant signup clicked')
    setTimeout(() => setIsGoogleLoading(false), 2000) // Mock loading
  }

  const onSubmit = (data: RestaurantFormData) => {
    console.log('Restaurant form submitted:', data)
    // TODO: Implement restaurant profile creation
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
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Restaurant Setup
        </h1>
        <p className="text-gray-600">
          Get your restaurant ready for QR code tipping
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i + 1 <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-8 h-0.5 mx-2 transition-colors ${
                i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
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
              <Chrome className="w-5 h-5 mr-3 text-blue-600" />
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

      {/* Step 2: Restaurant Details */}
      {currentStep === 2 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Restaurant Details</h3>
            <p className="text-gray-600">
              Tell us about your restaurant
            </p>
          </div>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario's Pizza" {...field} />
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
                          <SelectValue placeholder="Select restaurant type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RESTAURANT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Family-owned Italian restaurant serving authentic pizza since 1985..."
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

      {/* Step 3: Location & Contact */}
      {currentStep === 3 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Location & Contact</h3>
            <p className="text-gray-600">
              Help customers find you
            </p>
          </div>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
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
                      <Globe className="w-4 h-4 inline mr-2" />
                      Website (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://mariospizza.com" {...field} />
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
            <Button onClick={form.handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700">
              Create Restaurant Profile
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
            <div className="text-blue-600 font-bold">∞</div>
            <div className="text-gray-600">QR Codes</div>
          </div>
          <div>
            <div className="text-green-600 font-bold">2%</div>
            <div className="text-gray-600">Platform Fee</div>
          </div>
          <div>
            <div className="text-purple-600 font-bold">1s</div>
            <div className="text-gray-600">Tip Processing</div>
          </div>
        </div>
      </motion.div>

      {/* Sign in link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
