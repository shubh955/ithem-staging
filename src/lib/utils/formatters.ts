export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getWhatsAppUrl(whatsappNumber: string, message = ''): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${whatsappNumber}${message ? `?text=${encoded}` : ''}`
}
