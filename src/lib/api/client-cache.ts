'use client'

type JsonValue = unknown

const jsonCache = new Map<string, Promise<JsonValue>>()

export async function fetchCachedJson<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || 'GET'

  if (method !== 'GET') {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json()
  }

  const key = url
  let request = jsonCache.get(key)

  if (!request) {
    request = fetch(url, {
      ...options,
      cache: options?.cache || 'force-cache',
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      return response.json()
    })

    jsonCache.set(key, request)
  }

  return request as Promise<T>
}
