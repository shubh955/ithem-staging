export interface NavChild {
  label: string
  href: string
  description?: string
  image?: string
}

export interface NavColumn {
  heading?: string
  headingHref?: string
  items: NavChild[]
}

export interface NavItem {
  label: string
  href?: string
  children?: NavColumn[]
  defaultImage?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    defaultImage: 'https://itherm.co.in/wp-content/uploads/2025/01/2-PID-Temp-Contro.jpg',
  },
  {
    label: 'Resources',
    href: '/datasheets',
    defaultImage: '/rd_lab_precision_1778054176204.png',
    children: [
      {
        heading: 'Documentation',
        items: [
          { label: 'Technical Datasheets', href: '/datasheets', description: 'Download technical specs for all models' },
          { label: 'Software & Catalogs', href: '/downloads', description: 'Download utility software and product catalogs' },
          { label: 'Operating Manuals', href: '/resources/guides', description: 'AI-5742, Humi-Temp & more' },
          { label: 'FAQs', href: '/resources/faqs' },
        ],
      },
      {
        heading: 'Learn',
        items: [
          { label: 'Application Notes', href: '/resources/blog' },
          { label: 'Case Studies', href: '/resources/case-studies' },
        ],
      },
    ],
  },
  { label: 'Company', href: '/about' },
  { label: 'Contact', href: '/contact' },
]
