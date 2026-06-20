'use client'

type JsonValue = unknown

const jsonCache = new Map<string, { promise: Promise<JsonValue>; timestamp: number }>()
const CACHE_TTL = 30 * 1000 // 30 seconds client-side cache TTL

export async function fetchCachedJson<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || 'GET'

  if (method !== 'GET') {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json()
  }

  const key = url
  const now = Date.now()
  const cached = jsonCache.get(key)

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.promise as Promise<T>
  }

  const promise = fetch(url, {
    ...options,
    cache: options?.cache || 'no-cache',
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json()
  }).catch((err) => {
    // If request fails, clean up the cache entry so it can be retried next time
    jsonCache.delete(key)
    throw err
  })

  jsonCache.set(key, { promise, timestamp: now })

  return promise as Promise<T>
}
