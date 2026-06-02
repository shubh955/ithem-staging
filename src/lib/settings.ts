import { SITE_CONFIG } from '@/lib/utils/constants'

const SETTINGS_URL = 'https://backend.itherm.co.in/wp-json/custom/v1/settings'
const SETTINGS_REVALIDATE_SECONDS = 300

export type SiteSettings = {
  phone1: string
  phone2: string
  supportNumber: string
  email: string
  address: string
  addressLines: string[]
  whatsapp: string
}

type RawSiteSettings = {
  phone_1?: unknown
  phone_2?: unknown
  support_number?: unknown
  email?: unknown
  address?: unknown
  whatsapp?: unknown
}

const fallbackSettings: SiteSettings = {
  phone1: SITE_CONFIG.phone1,
  phone2: SITE_CONFIG.phone3,
  supportNumber: SITE_CONFIG.supportPhone,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  addressLines: [SITE_CONFIG.addressLine1, SITE_CONFIG.addressLine2, SITE_CONFIG.addressLine3],
  whatsapp: SITE_CONFIG.whatsapp,
}

function cleanString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function splitAddress(address: string) {
  return address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function getTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function normalizeSiteSettings(raw: RawSiteSettings | null | undefined): SiteSettings {
  const address = cleanString(raw?.address, fallbackSettings.address)
  const addressLines = splitAddress(address)

  return {
    phone1: cleanString(raw?.phone_1, fallbackSettings.phone1),
    phone2: cleanString(raw?.phone_2, fallbackSettings.phone2),
    supportNumber: cleanString(raw?.support_number, fallbackSettings.supportNumber),
    email: cleanString(raw?.email, fallbackSettings.email),
    address,
    addressLines: addressLines.length > 0 ? addressLines : fallbackSettings.addressLines,
    whatsapp: cleanString(raw?.whatsapp, fallbackSettings.whatsapp),
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(SETTINGS_URL, {
      headers: {
        Accept: 'application/json',
      },
      next: {
        revalidate: SETTINGS_REVALIDATE_SECONDS,
        tags: ['site-settings'],
      },
    })

    if (!response.ok) return fallbackSettings

    return normalizeSiteSettings(await response.json())
  } catch {
    return fallbackSettings
  }
}
