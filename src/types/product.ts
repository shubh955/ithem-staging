export interface ProductSpec {
  parameter: string
  value: string
  unit?: string
}

export interface Datasheet {
  label: string
  fileUrl: string
  fileType: 'pdf' | 'dwg' | 'image'
}

export interface UseCase {
  title: string
  description: string
  industry?: string
}

export interface Product {
  id: number
  slug: string
  name: string
  categorySlug: string
  categoryName: string
  description: string
  tagline: string
  productCode: string
  imageUrl: string
  imageAlt: string
  specifications: ProductSpec[]
  features: string[]
  useCases: UseCase[]
  wiringDiagramUrl: string | null
  datasheets: Datasheet[]
  relatedProductIds: number[]
  isFeatured: boolean
  badgeText: string | null
  applications: string[]
  modifiedDate: string
}

export interface ProductCategory {
  id: number
  slug: string
  name: string
  description: string
  imageUrl: string
  imageAlt: string
  productCount: number
}

export interface ProductQueryParams {
  category?: string
  page?: number
  perPage?: number
  featured?: boolean
}
