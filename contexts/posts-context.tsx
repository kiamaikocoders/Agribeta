"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './auth-context'
import { toast } from '@/components/ui/use-toast'

export interface Post {
  id: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
  shares_count: number
  images?: string[]
  is_liked?: boolean
  author: {
    first_name: string
    last_name: string
    avatar_url: string
    role: string
  }
}

interface PostsContextType {
  posts: Post[]
  loading: boolean
  createPost: (content: string, images?: File[]) => Promise<void>
  likePost: (postId: string) => Promise<void>
  deletePost: (postId: string) => Promise<void>
  refreshPosts: () => Promise<void>
  getUserPosts: (userId: string) => Post[]
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      
      // For now, we'll use mock data since we don't have a posts table yet
      // In a real implementation, you'd fetch from a posts table
      const mockPosts: Post[] = [
        {
          id: '1',
          content: "Just harvested my first batch of avocados! The quality is amazing. Thanks to AgriBeta for the irrigation tips that helped increase my yield by 30%! 🥑🌱",
          author_id: user?.id || '',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          likes_count: 12,
          comments_count: 3,
          shares_count: 2,
          images: ['/avocado-diseases-chart.png'],
          is_liked: false,
          author: {
            first_name: profile?.first_name || 'User',
            last_name: profile?.last_name || '',
            avatar_url: profile?.avatar_url || '',
            role: profile?.role || 'farmer'
          }
        },
        {
          id: '2',
          content: "Facing some challenges with pest management in my greenhouse. Anyone have experience with aphids on tomato plants? Looking for organic solutions.",
          author_id: user?.id || '',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          likes_count: 8,
          comments_count: 7,
          shares_count: 1,
          is_liked: true,
          author: {
            first_name: profile?.first_name || 'User',
            last_name: profile?.last_name || '',
            avatar_url: profile?.avatar_url || '',
            role: profile?.role || 'farmer'
          }
        },
        {
          id: '3',
          content: "Great session with Dr. Sarah Johnson today! She helped me identify a nutrient deficiency in my soil. The recommendations were spot on and easy to implement.",
          author_id: 'agronomist-1',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          likes_count: 15,
          comments_count: 4,
          shares_count: 3,
          is_liked: false,
          author: {
            first_name: 'Sarah',
            last_name: 'Johnson',
            avatar_url: '',
            role: 'agronomist'
          }
        }
      ]

      setPosts(mockPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string, images?: File[]) => {
    if (!user || !profile) return

    try {
      // In a real implementation, you'd save to a posts table
      const newPost: Post = {
        id: Date.now().toString(),
        content,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        images: images?.map((_, index) => `/uploaded-image-${index}.jpg`), // Mock image URLs
        is_liked: false,
        author: {
          first_name: profile.first_name || 'User',
          last_name: profile.last_name || '',
          avatar_url: profile.avatar_url || '',
          role: profile.role || 'farmer'
        }
      }

      setPosts(prev => [newPost, ...prev])
      
      toast({
        title: 'Post created',
        description: 'Your post has been shared successfully!'
      })
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const likePost = async (postId: string) => {
    if (!user) return

    try {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const deletePost = async (postId: string) => {
    if (!user) return

    try {
      setPosts(prev => prev.filter(post => post.id !== postId))
      
      toast({
        title: 'Post deleted',
        description: 'Your post has been deleted successfully!'
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const getUserPosts = (userId: string) => {
    return posts.filter(post => post.author_id === userId)
  }

  const refreshPosts = async () => {
    await fetchPosts()
  }

  useEffect(() => {
    fetchPosts()
  }, [user, profile])

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        createPost,
        likePost,
        deletePost,
        refreshPosts,
        getUserPosts
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider')
  }
  return context
}
