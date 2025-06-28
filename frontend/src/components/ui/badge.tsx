import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ingredient'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-transparent bg-green-500 text-primary-foreground shadow hover:bg-green-500/80',
      secondary: 'border-transparent bg-red-500 text-primary-foreground shadow hover:bg-red-500/80',
      destructive: 'border-transparent bg-yellow-500 text-primary-foreground shadow hover:bg-yellow-500/80',
      outline: 'border-transparent bg-cyan-500 text-primary-foreground shadow hover:bg-cyan-500/80',
      ingredient: 'border-transparent bg-gray-200 text-gray-800 shadow-none'
    }

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge } 