import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark active:scale-95 shadow-sm',
        secondary: 'bg-dark text-white hover:bg-dark-700 border border-dark-500',
        outline: 'border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
        ghost: 'text-brand-orange hover:bg-orange-50',
        white: 'bg-white text-dark hover:bg-gray-100 shadow-sm',
        'white-outline': 'border border-white text-white hover:bg-white hover:text-dark',
      },
      size: {
        sm: 'px-4 py-2 text-sm rounded-md',
        md: 'px-6 py-3 text-base rounded-lg',
        lg: 'px-8 py-4 text-lg rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonAsButton = VariantProps<typeof buttonVariants> & {
  href?: undefined
  className?: string
  children: React.ReactNode
} & ComponentPropsWithoutRef<'button'>

type ButtonAsLink = VariantProps<typeof buttonVariants> & {
  href: string
  className?: string
  children: React.ReactNode
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink
    return (
      <Link href={href} className={classes} {...(rest as object)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  )
}
