import { useState, useEffect } from 'react'
import { AppwriteDatabase, appwriteConfig } from '@/lib/appwrite'
import { Video } from '@/types/video'
import { Query } from 'appwrite'

interface UseVideosReturn {
  videos: Video[]
  loading: boolean
  error: string | null
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>
  updateVideo: (id: string, updates: Partial<Video>) => Promise<void>
  deleteVideo: (id: string) => Promise<void>
  refreshVideos: () => Promise<void>
  incrementViews: (id: string) => Promise<void>
}

export const useVideos = (): UseVideosReturn => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load videos from Appwrite - simplified and fast version
  const loadVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!appwriteConfig.videosCollectionId) {
        // Mock data for testing
        const mockVideos: Video[] = [
          {
            id: 'mock-1',
            title: 'Exclusive Premium Content #1',
            description: 'Special and exclusive material available only for subscribers.',
            price: 25.00,
            duration: '25:30',
            uploadDate: '2024-01-15',
            status: 'published',
            views: 15420,
            tags: ['Premium', 'Exclusive', 'VIP']
          },
          {
            id: 'mock-2',
            title: 'Special Pack - Limited Edition',
            description: 'Special collection with unprecedented and high-quality content.',
            price: 35.00,
            duration: '32:15',
            uploadDate: '2024-01-12',
            status: 'published',
            views: 8930,
            tags: ['Pack', 'Limited', 'Special']
          },
          {
            id: 'mock-3',
            title: 'VIP Private Session',
            description: 'Unique and personalized experience for VIP members.',
            price: 45.00,
            duration: '45:45',
            uploadDate: '2024-01-10',
            status: 'published',
            views: 12750,
            tags: ['VIP', 'Private', 'Custom']
          }
        ]
        setVideos(mockVideos)
        return
      }

      // Simplified query - load published videos only
      const queries = [
        Query.equal('status', 'published'),
        Query.orderDesc('$createdAt')
      ]

      type RawDoc = {
        $id?: unknown
        title?: unknown
        description?: unknown
        price?: unknown
        duration?: unknown
        uploadDate?: unknown
        status?: unknown
        views?: unknown
        tags?: unknown
        videoFileId?: unknown
        videoUrl?: unknown
        fileSize?: unknown
        mimeType?: unknown
        productLink?: unknown
      }
      const response = await AppwriteDatabase.listDocuments(
        appwriteConfig.videosCollectionId,
        queries
      ) as unknown as { documents: RawDoc[] }

      const loaded: Video[] = (response.documents || []).map((doc) => ({
        id: String(doc.$id),
        title: String(doc.title ?? ''),
        description: String(doc.description ?? ''),
        price: Number(doc.price ?? 0),
        duration: (doc.duration as string | undefined),
        uploadDate: (doc.uploadDate as string | undefined),
        status: (doc.status as 'published' | 'draft' | 'processing'),
        views: Number(doc.views ?? 0),
        tags: typeof doc.tags === 'string' && doc.tags.length > 0 ? String(doc.tags).split(',') : [],
        videoFileId: doc.videoFileId as string | undefined,
        videoUrl: doc.videoUrl as string | undefined,
        fileSize: typeof doc.fileSize === 'number' ? doc.fileSize : undefined,
        mimeType: doc.mimeType as string | undefined,
        productLink: doc.productLink as string | undefined
      }))

      setVideos(loaded)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  // Add new video
  const addVideo = async (videoData: Omit<Video, 'id'>) => {
    try {
      if (!appwriteConfig.videosCollectionId) {
        throw new Error('Appwrite configuration not found')
      }

      const response = await AppwriteDatabase.createDocument(
        appwriteConfig.videosCollectionId,
        {
          title: videoData.title,
          description: videoData.description,
          price: videoData.price,
          duration: videoData.duration,
          uploadDate: videoData.uploadDate,
          status: videoData.status,
          views: videoData.views || 0,
          tags: videoData.tags && videoData.tags.length > 0 ? videoData.tags.join(',').substring(0, 1000) : '',
          videoFileId: videoData.videoFileId,
          videoUrl: videoData.videoUrl,
          productLink: videoData.productLink || ''
        }
      ) as { $id: string }

      const newVideo: Video = {
        id: response.$id,
        ...videoData
      }

      setVideos(prev => [newVideo, ...prev])
    } catch (err) {
      console.error('Error adding video:', err)
      throw err
    }
  }

  // Update video
  const updateVideo = async (id: string, updates: Partial<Video>) => {
    try {
      if (!appwriteConfig.videosCollectionId) {
        throw new Error('Appwrite configuration not found')
      }

      // Convert tags array to string if present
      const updateData: Record<string, unknown> = { ...updates }
      if (updates.tags !== undefined) {
        updateData.tags = updates.tags && updates.tags.length > 0 ? updates.tags.join(',').substring(0, 1000) : ''
      }

      await AppwriteDatabase.updateDocument(
        appwriteConfig.videosCollectionId,
        id,
        updateData
      )

      setVideos(prev => prev.map(video => 
        video.id === id ? { ...video, ...updates } : video
      ))
    } catch (err) {
      console.error('Error updating video:', err)
      throw err
    }
  }

  // Delete video
  const deleteVideo = async (id: string) => {
    try {
      await AppwriteDatabase.deleteDocument(
        appwriteConfig.videosCollectionId,
        id
      )
      setVideos(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      console.error('Error deleting video:', err)
      throw err
    }
  }

  const incrementViews = async (id: string) => {
    try {
      await updateVideo(id, { views: (videos.find(v => v.id === id)?.views || 0) + 1 })
    } catch (_e) {}
  }

  useEffect(() => {
    loadVideos()
  }, [])

  const refreshVideos = loadVideos

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    refreshVideos,
    incrementViews
  }
}
