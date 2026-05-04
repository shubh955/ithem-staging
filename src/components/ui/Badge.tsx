import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        orange: 'bg-brand-orange text-white',
        dark: 'bg-dark text-white',
        outline: 'border border-brand-orange text-brand-orange',
        muted: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
      },
    },
    defaultVariants: { variant: 'orange' },
  }
)

type BadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string
  children: React.ReactNode
}

export function Badge({ variant, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
}
