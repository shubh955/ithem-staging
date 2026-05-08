export interface NavChild {
  label: string
  href: string
  description?: string
  image?: string
}

export interface NavColumn {
  heading?: string
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
    children: [
      {
        heading: 'Temperature Controllers',
        items: [
          { 
            label: 'AI-5442 / AI-5742 / AI-5942', 
            href: '/products/temperature-controllers/ai-5x42-series', 
            description: '48×48, 72×72, 96×96 MM — Single row',
            image: 'https://itherm.co.in/wp-content/uploads/2025/01/1-Digital-Temp-Contro.jpg'
          },
          { 
            label: 'AI-7481 / AI-7482 / AI-7483', 
            href: '/products/temperature-controllers/ai-7481-series', 
            description: '48×48 MM — Dual row, PID',
            image: 'https://itherm.co.in/wp-content/uploads/2025/01/2-PID-Temp-Contro.jpg'
          },
          { 
            label: 'AI-7782 / AI-7982 / AI-7983', 
            href: '/products/temperature-controllers/ai-7782-series', 
            description: '72×72 & 96×96 MM — Advanced',
            image: 'https://itherm.co.in/wp-content/uploads/2025/01/2-PID-Temp-Contro.jpg'
          },
          { label: 'All Temperature Controllers', href: '/products/temperature-controllers' },
        ],
      },
      {
        heading: 'Timers & Counters',
        items: [
          { 
            label: 'KCN-444 / KCN-448', 
            href: '/products/timers-counters/kcn-444-series', 
            description: '48×48 MM counters',
            image: 'https://itherm.co.in/wp-content/uploads/2024/12/Cx-928-1-300x300.jpg'
          },
          { 
            label: 'KCN-664 to KCN-888', 
            href: '/products/timers-counters/kcn-medium-series', 
            description: '72×72 & 96×96 MM counters',
            image: 'https://itherm.co.in/wp-content/uploads/2024/12/Cx-928-1-300x300.jpg'
          },
          { label: 'All Timers & Counters', href: '/products/timers-counters' },
        ],
      },
      {
        heading: 'Specialty Instruments',
        items: [
          { 
            label: 'Humidity Controllers (Humi-Temp)', 
            href: '/products/humidity-controllers', 
            description: 'Temperature & %rH dual control',
            image: 'https://itherm.co.in/wp-content/uploads/2025/01/7-Humidity-Controller.jpg'
          },
          { label: 'Data Loggers', href: '/products/data-loggers', description: 'AI-Logger, USB, Autoclave VA' },
          { label: 'ULT Controllers', href: '/products/ult-controllers', description: 'Ultra-low temperature' },
          { label: 'Autoclave Controllers', href: '/products/autoclave-controllers', description: 'Sterilization cycle control' },
          { label: 'All Products', href: '/products' },
        ],
      },
    ],
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
