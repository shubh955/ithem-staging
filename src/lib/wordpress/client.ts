import { WordPressAPIError } from '@/types'

const WP_API_BASE = `${process.env.WORDPRESS_API_URL ?? 'https://cms.itherm.in'}/wp-json/wp/v2`

interface FetchOptions {
  tags?: string[]
  revalidate?: number
}

export async function fetchWordPress<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { tags = ['wordpress'], revalidate = 3600 } = options
  const url = `${WP_API_BASE}${endpoint}`

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      next: { revalidate, tags },
    })

    if (!res.ok) throw new WordPressAPIError(res.status, endpoint)
    return res.json() as Promise<T>
  } catch (error) {
    if (error instanceof WordPressAPIError) throw error
    throw new WordPressAPIError(0, endpoint)
  }
}
