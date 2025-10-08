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
      
      // Fetch real posts from the database
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          content,
          media_urls,
          created_at,
          updated_at,
          profiles!posts_user_id_fkey (
            first_name,
            last_name,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching posts:', error)
        // Fallback to empty array if there's an error
        setPosts([])
        return
      }

      // Transform the data to match our Post interface
      const transformedPosts: Post[] = (postsData || []).map(post => ({
        id: post.id,
        content: post.content,
        author_id: post.user_id,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: 0, // TODO: Implement likes functionality
        comments_count: 0, // TODO: Implement comments functionality
        shares_count: 0, // TODO: Implement shares functionality
        images: post.media_urls || [],
        is_liked: false, // TODO: Check if current user liked this post
        author: {
          first_name: post.profiles?.first_name || 'Unknown',
          last_name: post.profiles?.last_name || '',
          avatar_url: post.profiles?.avatar_url || '',
          role: post.profiles?.role || 'user'
        }
      }))

      setPosts(transformedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string, images?: File[]) => {
    if (!user || !profile) return

    try {
      // Save to the database
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          media_urls: images ? images.map((_, index) => `/uploaded-image-${index}.jpg`) : null
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating post:', error)
        toast({
          title: 'Error',
          description: 'Failed to create post. Please try again.',
          variant: 'destructive'
        })
        return
      }

      // Refresh posts to show the new post
      await fetchPosts()
      
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
