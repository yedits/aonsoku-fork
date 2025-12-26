import omit from 'lodash/omit'
import { useAppStore } from '@/store/app.store'
import { CoverArt } from '@/types/coverArtType'
import { AuthType } from '@/types/serverConfig'
import { appName } from '@/utils/appName'
import { saltWord } from '@/utils/salt'

export type QueryType = Record<string, string | number | undefined>

export interface FetchOptions extends RequestInit {
  query?: QueryType
}

type AuthParams = { u: string; t: string; s: string } | { u: string; p: string }

export function authQueryParams(
  username: string,
  password: string,
  authType: AuthType | null,
): AuthParams {
  if (authType === AuthType.TOKEN) {
    return {
      u: username ?? '',
      t: password ?? '',
      s: saltWord,
    }
  } else if (authType === AuthType.PASSWORD) {
    return {
      u: username ?? '',
      p: password ?? '',
    }
  }
  throw new Error('Invalid/unspecified auth type')
}

function queryParams() {
  const { username, password, authType, protocolVersion } =
    useAppStore.getState().data

  return {
    ...authQueryParams(username, password, authType),
    v: protocolVersion || '1.16.0',
    c: appName,
    f: 'json',
  }
}

function getUrl(path: string, options?: QueryType) {
  const serverUrl = useAppStore.getState().data.url
  const params = new URLSearchParams(queryParams())

  if (options) {
    Object.keys(options).forEach((key) => {
      const query = options[key]

      if (query !== undefined) {
        params.append(key, query.toString())
      }
    })
  }

  const queries = params.toString()
  const pathWithoutSlash = path.startsWith('/') ? path.substring(1) : path
  let url = `${serverUrl}/rest/${pathWithoutSlash}`
  url += path.includes('?') ? '&' : '?'
  url += queries

  return url
}

async function browserFetch<T>(
  url: string,
  options: RequestInit,
): Promise<{ count: number; data: T } | undefined> {
  try {
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      return {
        count: parseInt(response.headers.get('x-total-count') || '0', 10),
        data: data['subsonic-response'] as T,
      }
    }

    return undefined
  } catch (error) {
    console.error('Error on browserFetch request', error)
    return undefined
  }
}

export async function httpClient<T>(
  path: string,
  options: FetchOptions,
): Promise<{ count: number; data: T } | undefined> {
  try {
    const url = getUrl(path, options.query)
    const init = omit(options, 'query')

    return await browserFetch<T>(url, init)
  } catch (error) {
    console.error('Error on httpClient request', error)
    return undefined
  }
}

// Cache for cover art URLs to prevent regenerating auth params on every call
const coverArtUrlCache = new Map<string, string>()
let lastAuthState = ''

function getCacheKey(id: string | undefined, type: CoverArt, size: string): string {
  return `${id || 'default'}_${type}_${size}`
}

function getCurrentAuthState(): string {
  const { username, password, authType } = useAppStore.getState().data
  return `${username}:${password}:${authType}`
}

// Clear cache when auth state changes
function clearCoverArtCache() {
  coverArtUrlCache.clear()
  console.log('[httpClient] Cover art cache cleared')
}

export function getCoverArtUrl(
  id?: string,
  type: CoverArt = 'album',
  size = '300',
): string {
  // Handle default cover art (no auth needed)
  if (!id) {
    type = type === 'artist' ? 'artist' : 'album'
    return `/default_${type}_art.webp`
  }

  // Check if auth state changed (user logged out/in)
  const currentAuthState = getCurrentAuthState()
  if (currentAuthState !== lastAuthState) {
    clearCoverArtCache()
    lastAuthState = currentAuthState
  }

  // Check cache first
  const cacheKey = getCacheKey(id, type, size)
  const cachedUrl = coverArtUrlCache.get(cacheKey)
  
  if (cachedUrl) {
    return cachedUrl
  }

  // Generate new URL and cache it
  const url = getUrl('getCoverArt', {
    id,
    size,
  })
  
  coverArtUrlCache.set(cacheKey, url)
  return url
}

export function getSongStreamUrl(
  id: string,
  maxBitRate?: string,
  format?: string,
) {
  return getUrl('stream', {
    id,
    maxBitRate,
    format,
    estimateContentLength: 'true',
  })
}

export function getDownloadUrl(id: string, maxBitRate = '0', format = 'raw') {
  return getUrl('download', {
    id,
    maxBitRate,
    format,
  })
}