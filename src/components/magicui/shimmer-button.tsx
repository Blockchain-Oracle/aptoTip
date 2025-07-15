'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  asChild?: boolean
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({
    children,
    className,
    shimmerColor = '#ffffff',
    shimmerSize = '100px',
    borderRadius = '8px',
    shimmerDuration = '3s',
    background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    asChild = false,
    ...props
  }, ref) => {
    if (asChild) {
      return (
        <div
          className={cn(
            'group relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50',
            className
          )}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span
            className={cn(
              'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
            )}
          >
            {children}
          </span>
        </div>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50',
          className
        )}
        style={{
          background,
          borderRadius,
        }}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span
          className={cn(
            'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
          )}
        >
          {children}
        </span>
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'

export { ShimmerButton } 