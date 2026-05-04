export interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  productInterest: string
  quantity: string
  message: string
  inquiryType: 'product' | 'custom' | 'dealer' | 'general'
}

export interface FormState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}
