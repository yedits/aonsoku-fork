import { create } from 'zustand'
import { get, set, del, entries } from 'idb-keyval'

export enum ArtworkType {
  SingleCover = 'single-cover',
  Artwork = 'artwork',
  AlbumCover = 'album-cover',
}

export interface CustomArtwork {
  id: string
  artworkName: string
  artistName: string
  editor?: string
  compEra: string // Comp/Era
  type: ArtworkType
  description: string
  imageData: string // Base64 encoded image
  uploadedAt: number
  downloads: number // Download counter
  tags?: string[]
}

// Track downloads for album covers from Subsonic
export interface AlbumDownload {
  albumId: string
  downloads: number
}

interface ArtworkStore {
  artworks: CustomArtwork[]
  albumDownloads: Record<string, number>
  isLoading: boolean
  loadArtworks: () => Promise<void>
  addArtwork: (artwork: Omit<CustomArtwork, 'id' | 'uploadedAt' | 'downloads'>) => Promise<void>
  updateArtwork: (id: string, artwork: Partial<CustomArtwork>) => Promise<void>
  deleteArtwork: (id: string) => Promise<void>
  getArtwork: (id: string) => CustomArtwork | undefined
  incrementDownload: (id: string) => Promise<void>
  incrementAlbumDownload: (albumId: string) => Promise<void>
  getAlbumDownloads: (albumId: string) => number
}

const ARTWORK_STORE_KEY = 'custom-artworks'
const ALBUM_DOWNLOADS_KEY = 'album-downloads'

export const useArtworkStore = create<ArtworkStore>((setState, getState) => ({
  artworks: [],
  albumDownloads: {},
  isLoading: false,

  loadArtworks: async () => {
    setState({ isLoading: true })
    try {
      const storedArtworks = await get<CustomArtwork[]>(ARTWORK_STORE_KEY)
      const storedAlbumDownloads = await get<Record<string, number>>(ALBUM_DOWNLOADS_KEY)
      
      // Migrate old artworks to include downloads field
      const migratedArtworks = (storedArtworks || []).map(artwork => ({
        ...artwork,
        downloads: artwork.downloads ?? 0,
      }))
      
      setState({ 
        artworks: migratedArtworks, 
        albumDownloads: storedAlbumDownloads || {},
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to load artworks:', error)
      setState({ artworks: [], albumDownloads: {}, isLoading: false })
    }
  },

  addArtwork: async (artworkData) => {
    const newArtwork: CustomArtwork = {
      ...artworkData,
      id: `artwork-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: Date.now(),
      downloads: 0,
    }

    const currentArtworks = getState().artworks
    const updatedArtworks = [...currentArtworks, newArtwork]

    try {
      await set(ARTWORK_STORE_KEY, updatedArtworks)
      setState({ artworks: updatedArtworks })
    } catch (error) {
      console.error('Failed to add artwork:', error)
      throw error
    }
  },

  updateArtwork: async (id, updates) => {
    const currentArtworks = getState().artworks
    const updatedArtworks = currentArtworks.map((artwork) =>
      artwork.id === id ? { ...artwork, ...updates } : artwork
    )

    try {
      await set(ARTWORK_STORE_KEY, updatedArtworks)
      setState({ artworks: updatedArtworks })
    } catch (error) {
      console.error('Failed to update artwork:', error)
      throw error
    }
  },

  deleteArtwork: async (id) => {
    const currentArtworks = getState().artworks
    const updatedArtworks = currentArtworks.filter(
      (artwork) => artwork.id !== id
    )

    try {
      await set(ARTWORK_STORE_KEY, updatedArtworks)
      setState({ artworks: updatedArtworks })
    } catch (error) {
      console.error('Failed to delete artwork:', error)
      throw error
    }
  },

  getArtwork: (id) => {
    return getState().artworks.find((artwork) => artwork.id === id)
  },

  incrementDownload: async (id) => {
    const currentArtworks = getState().artworks
    const updatedArtworks = currentArtworks.map((artwork) =>
      artwork.id === id
        ? { ...artwork, downloads: (artwork.downloads || 0) + 1 }
        : artwork
    )

    try {
      await set(ARTWORK_STORE_KEY, updatedArtworks)
      setState({ artworks: updatedArtworks })
    } catch (error) {
      console.error('Failed to increment download:', error)
      throw error
    }
  },

  incrementAlbumDownload: async (albumId) => {
    const currentDownloads = getState().albumDownloads
    const updatedDownloads = {
      ...currentDownloads,
      [albumId]: (currentDownloads[albumId] || 0) + 1,
    }

    try {
      await set(ALBUM_DOWNLOADS_KEY, updatedDownloads)
      setState({ albumDownloads: updatedDownloads })
    } catch (error) {
      console.error('Failed to increment album download:', error)
      throw error
    }
  },

  getAlbumDownloads: (albumId) => {
    return getState().albumDownloads[albumId] || 0
  },
}))
