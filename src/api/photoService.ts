import type { PhotoResponse } from '@/types/photo'

export async function fetchNextPhoto(album?: string): Promise<PhotoResponse> {
  const url = new URL('/api/photos/next', window.location.origin)
  if (album) {
    url.searchParams.set('album', album)
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Failed to fetch next photo: ${response.status} ${response.statusText} ${errorBody}`)
  }

  return response.json()
}

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
  })
}
