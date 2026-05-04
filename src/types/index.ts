export * from './wordpress'
export * from './product'
export * from './solution'
export * from './industry'
export * from './blog'
export * from './form'

export interface Testimonial {
  id: number
  name: string
  designation: string
  company: string
  content: string
  rating: number
  imageUrl?: string
  industry?: string
}

export interface ClientLogo {
  id: number
  name: string
  logoUrl: string
  website?: string
  industry?: string
}

export interface GlobalSettings {
  companyName: string
  tagline: string
  phone: string
  email: string
  address: string
  whatsapp: string
  socialLinks: {
    linkedin?: string
    youtube?: string
    twitter?: string
    instagram?: string
  }
}

export interface SitemapEntry {
  path: string
  modified: string
  type: 'product' | 'solution' | 'industry' | 'blog' | 'case-study' | 'page'
}
