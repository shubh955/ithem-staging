export interface NavChild {
  label: string
  href: string
  description?: string
}

export interface NavColumn {
  heading?: string
  items: NavChild[]
}

export interface NavItem {
  label: string
  href?: string
  children?: NavColumn[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Products',
    children: [
      {
        heading: 'Temperature Controllers',
        items: [
          { label: 'AI-5442 / AI-5742 / AI-5942', href: '/products/temperature-controllers/ai-5x42-series', description: '48×48, 72×72, 96×96 MM — Single row' },
          { label: 'AI-7481 / AI-7482 / AI-7483', href: '/products/temperature-controllers/ai-7481-series', description: '48×48 MM — Dual row, PID' },
          { label: 'AI-7782 / AI-7982 / AI-7983', href: '/products/temperature-controllers/ai-7782-series', description: '72×72 & 96×96 MM — Advanced' },
          { label: 'All Temperature Controllers', href: '/products/temperature-controllers' },
        ],
      },
      {
        heading: 'Timers & Counters',
        items: [
          { label: 'KCN-444 / KCN-448', href: '/products/timers-counters/kcn-444-series', description: '48×48 MM counters' },
          { label: 'KCN-664 to KCN-888', href: '/products/timers-counters/kcn-medium-series', description: '72×72 & 96×96 MM counters' },
          { label: 'All Timers & Counters', href: '/products/timers-counters' },
        ],
      },
      {
        heading: 'Specialty Instruments',
        items: [
          { label: 'Humidity Controllers (Humi-Temp)', href: '/products/humidity-controllers', description: 'Temperature & %rH dual control' },
          { label: 'Data Loggers', href: '/products/data-loggers', description: 'AI-Logger, USB, Autoclave VA' },
          { label: 'ULT Controllers', href: '/products/ult-controllers', description: 'Ultra-low temperature' },
          { label: 'Autoclave Controllers', href: '/products/autoclave-controllers', description: 'Sterilization cycle control' },
          { label: 'All Products', href: '/products' },
        ],
      },
    ],
  },
  {
    label: 'Applications',
    children: [
      {
        heading: 'By Industry',
        items: [
          { label: 'Pharmaceutical', href: '/industries/pharmaceutical' },
          { label: 'Food Processing', href: '/industries/food-processing' },
          { label: 'Textile Dyeing', href: '/industries/textile' },
          { label: 'Plastics & Rubber', href: '/industries/plastics' },
          { label: 'Furnaces & Ovens', href: '/industries/furnaces-ovens' },
          { label: 'All Industries', href: '/industries' },
        ],
      },
      {
        heading: 'Application Specific',
        items: [
          { label: 'Autoclave / Sterilization', href: '/solutions/autoclave' },
          { label: 'Humidity & Temperature', href: '/solutions/humidity-control' },
          { label: 'Process Automation', href: '/solutions/process-automation' },
          { label: 'Data Logging & Validation', href: '/solutions/data-logging' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    children: [
      {
        heading: 'Documentation',
        items: [
          { label: 'Operating Manuals', href: '/resources/guides', description: 'AI-5742, Humi-Temp & more' },
          { label: 'Product Catalog 2024', href: '/resources/catalogs', description: 'Complete product range PDF' },
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
