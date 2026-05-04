import { cn } from '@/lib/utils/cn'
import type { ElementType, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  dark?: boolean
  as?: ElementType
}

export function Section({ children, className, id, dark, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'py-16 md:py-24',
        dark ? 'bg-dark text-white' : 'bg-white text-dark',
        className
      )}
    >
      {children}
    </Tag>
  )
}
