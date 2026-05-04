export interface WPRendered {
  rendered: string
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  media_details?: {
    width: number
    height: number
    sizes?: Record<string, { source_url: string; width: number; height: number }>
  }
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: string
}

export interface WPEmbedded {
  'wp:featuredmedia'?: WPMedia[]
  'wp:term'?: WPTerm[][]
  author?: Array<{ name: string; avatar_urls?: Record<string, string> }>
}

export interface WPPost {
  id: number
  slug: string
  status: string
  type: string
  link: string
  date: string
  modified: string
  title: WPRendered
  content: WPRendered
  excerpt: WPRendered
  featured_media: number
  acf?: Record<string, unknown>
  _embedded?: WPEmbedded
}

export interface WPPage extends WPPost {
  template: string
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  description: string
  count: number
  parent: number
}

export class WordPressAPIError extends Error {
  constructor(
    public status: number,
    public endpoint: string
  ) {
    super(`WordPress API error ${status} at ${endpoint}`)
    this.name = 'WordPressAPIError'
  }
}
