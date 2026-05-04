import type {
  WPPost,
  Product,
  ProductCategory,
  Solution,
  Industry,
  BlogPost,
  CaseStudy,
  FAQ,
  Catalog,
  Testimonial,
  ClientLogo,
} from '@/types'

function getImageUrl(post: WPPost, fallback = '/images/placeholder.jpg'): string {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? fallback
}

function getImageAlt(post: WPPost, fallback = ''): string {
  return post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? fallback
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

function calcReadTime(content: string): number {
  const words = stripHtml(content).split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function transformProduct(raw: WPPost): Product {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.title.rendered,
    categorySlug: (acf.category as string) ?? '',
    categoryName: (acf.category_name as string) ?? '',
    description: raw.content.rendered,
    tagline: (acf.tagline as string) ?? '',
    productCode: (acf.product_code as string) ?? '',
    imageUrl: getImageUrl(raw),
    imageAlt: getImageAlt(raw, raw.title.rendered),
    specifications: (acf.specifications as Product['specifications']) ?? [],
    features: (acf.features as string[]) ?? [],
    useCases: (acf.use_cases as Product['useCases']) ?? [],
    wiringDiagramUrl: (acf.wiring_diagram_url as string) ?? null,
    datasheets: (acf.datasheets as Product['datasheets']) ?? [],
    relatedProductIds: (acf.related_products as number[]) ?? [],
    isFeatured: Boolean(acf.is_featured),
    badgeText: (acf.badge_text as string) || null,
    applications: (acf.applications as string[]) ?? [],
    modifiedDate: raw.modified,
  }
}

export function transformProductCategory(raw: WPPost): ProductCategory {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.title.rendered,
    description: stripHtml(raw.excerpt.rendered),
    imageUrl: getImageUrl(raw),
    imageAlt: getImageAlt(raw, raw.title.rendered),
    productCount: (acf.product_count as number) ?? 0,
  }
}

export function transformSolution(raw: WPPost): Solution {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    description: raw.content.rendered,
    imageUrl: getImageUrl(raw),
    imageAlt: getImageAlt(raw, raw.title.rendered),
    challenges: (acf.challenges as string[]) ?? [],
    howWeHelp: (acf.how_we_help as string[]) ?? [],
    recommendedProductIds: (acf.recommended_products as number[]) ?? [],
    caseExamples: (acf.case_examples as string[]) ?? [],
    industries: (acf.industries as string[]) ?? [],
    modifiedDate: raw.modified,
  }
}

export function transformIndustry(raw: WPPost): Industry {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.title.rendered,
    description: raw.content.rendered,
    imageUrl: getImageUrl(raw),
    imageAlt: getImageAlt(raw, raw.title.rendered),
    challenges: (acf.challenges as string[]) ?? [],
    applications: (acf.applications as string[]) ?? [],
    recommendedSolutions: (acf.recommended_solutions as string[]) ?? [],
    modifiedDate: raw.modified,
  }
}

export function transformBlogPost(raw: WPPost): BlogPost {
  const authorArr = raw._embedded?.author
  const authorName = authorArr?.[0]?.name ?? 'I-Therm Team'
  const categories = raw._embedded?.['wp:term']?.[0]?.map((t) => t.name) ?? []
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    excerpt: stripHtml(raw.excerpt.rendered),
    content: raw.content.rendered,
    imageUrl: getImageUrl(raw),
    imageAlt: getImageAlt(raw, raw.title.rendered),
    date: raw.date,
    modifiedDate: raw.modified,
    author: authorName,
    categories,
    readTime: calcReadTime(raw.content.rendered),
  }
}

export function transformCaseStudy(raw: WPPost): CaseStudy {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    excerpt: stripHtml(raw.excerpt.rendered),
    content: raw.content.rendered,
    imageUrl: getImageUrl(raw),
    imageAlt: getImageAlt(raw, raw.title.rendered),
    client: (acf.client as string) ?? '',
    industry: (acf.industry as string) ?? '',
    challenge: (acf.challenge as string) ?? '',
    solution: (acf.solution as string) ?? '',
    results: (acf.results as string[]) ?? [],
    date: raw.date,
    modifiedDate: raw.modified,
  }
}

export function transformFAQ(raw: WPPost): FAQ {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    question: raw.title.rendered,
    answer: raw.content.rendered,
    category: (acf.faq_category as string) ?? 'General',
  }
}

export function transformCatalog(raw: WPPost): Catalog {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    description: stripHtml(raw.excerpt.rendered),
    fileUrl: (acf.file_url as string) ?? '',
    thumbnailUrl: getImageUrl(raw),
    fileSize: (acf.file_size as string) ?? '',
    category: (acf.catalog_category as string) ?? '',
  }
}

export function transformTestimonial(raw: WPPost): Testimonial {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    name: raw.title.rendered,
    designation: (acf.designation as string) ?? '',
    company: (acf.company as string) ?? '',
    content: stripHtml(raw.content.rendered),
    rating: (acf.rating as number) ?? 5,
    imageUrl: getImageUrl(raw, undefined),
    industry: (acf.industry as string) ?? '',
  }
}

export function transformClientLogo(raw: WPPost): ClientLogo {
  const acf = (raw.acf ?? {}) as Record<string, unknown>
  return {
    id: raw.id,
    name: raw.title.rendered,
    logoUrl: getImageUrl(raw),
    website: (acf.website as string) ?? '',
    industry: (acf.industry as string) ?? '',
  }
}
