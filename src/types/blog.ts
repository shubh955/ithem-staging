export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  imageAlt: string
  date: string
  modifiedDate: string
  author: string
  categories: string[]
  readTime: number
}

export interface BlogCategory {
  id: number
  slug: string
  name: string
  count: number
}

export interface CaseStudy {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  imageAlt: string
  client: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  date: string
  modifiedDate: string
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

export interface Catalog {
  id: number
  slug: string
  title: string
  description: string
  fileUrl: string
  thumbnailUrl: string
  fileSize: string
  category: string
}

export interface Guide {
  id: number
  slug: string
  title: string
  description: string
  content: string
  imageUrl: string
  tags: string[]
}
