"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Send,
  Loader2,
  ThumbsUp,
  Bookmark,
  Flag
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { PostActions } from './post-actions'

interface Post {
  id: string
  user_id: string
  content: string
  media_urls?: string[]
  media_types?: string[]
  created_at: string
  profiles?: {
    first_name: string
    last_name: string
    role: string
    avatar_url?: string
    is_verified: boolean
  }
}

interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: {
    first_name: string
    last_name: string
    role: string
    avatar_url?: string
  }
}

interface PostInteractionsProps {
  post: Post
  onUpdate: () => void
}

export function PostInteractions({ post, onUpdate }: PostInteractionsProps) {
  const { user, profile } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPostStats()
      fetchComments()
    }
  }, [user, post.id])

  const fetchPostStats = async () => {
    try {
      // Get like count
      const { count: likes } = await supabase
        .from('post_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)
        .eq('interaction_type', 'like')

      // Get comment count
      const { count: comments } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)

      // Get share count
      const { count: shares } = await supabase
        .from('post_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)
        .eq('interaction_type', 'share')

      // Check if current user liked this post
      const { data: userLike } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user?.id)
        .eq('interaction_type', 'like')
        .single()

      setLikeCount(likes || 0)
      setCommentCount(comments || 0)
      setShareCount(shares || 0)
      setIsLiked(!!userLike)
    } catch (error) {
      console.error('Error fetching post stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            role,
            avatar_url
          )
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to like posts',
        variant: 'destructive'
      })
      return
    }

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_interactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user?.id)
          .eq('interaction_type', 'like')

        if (error) throw error
        setIsLiked(false)
        setLikeCount(prev => prev - 1)
      } else {
        // Like - check if already exists first
        const { data: existingLike } = await supabase
          .from('post_interactions')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', user?.id)
          .eq('interaction_type', 'like')
          .single()

        if (existingLike) {
          // Already liked, just update state
          setIsLiked(true)
          return
        }

        // Insert new like
        const { error } = await supabase
          .from('post_interactions')
          .insert([{
            post_id: post.id,
            user_id: user.id,
            interaction_type: 'like'
          }])

        if (error) throw error
        setIsLiked(true)
        setLikeCount(prev => prev + 1)

        // Create notification for post owner
        try {
          if (post.user_id !== user.id) {
            await supabase.from('notifications').insert({
              user_id: post.user_id,
              sender_id: user.id,
              type: 'like',
              title: 'New Like',
              message: `${profile?.first_name || 'Someone'} liked your post`,
            })
          }
        } catch (err) {
          // Non-blocking
          console.warn('Failed to create like notification', err)
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleComment = async () => {
    if (!user || !newComment.trim()) return

    setIsCommenting(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim()
        }])

      if (error) throw error

      setNewComment('')
      setCommentCount(prev => prev + 1)
      fetchComments() // Refresh comments
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted!'
      })

      // Create notification for post owner
      try {
        if (post.user_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            sender_id: user.id,
            type: 'comment',
            title: 'New Comment',
            message: `${profile?.first_name || 'Someone'} commented on your post`,
          })
        }
      } catch (err) {
        // Non-blocking
        console.warn('Failed to create comment notification', err)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsCommenting(false)
    }
  }

  const handleShare = async () => {
    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to share posts',
        variant: 'destructive'
      })
      return
    }

    try {
      // Check if user already shared this post
      const { data: existingShare } = await supabase
        .from('post_interactions')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user?.id)
        .eq('interaction_type', 'share')
        .single()

      if (existingShare) {
        toast({
          title: 'Already shared',
          description: 'You have already shared this post',
          variant: 'destructive'
        })
        return
      }

      // Record share
      const { error } = await supabase
        .from('post_interactions')
        .insert([{
          post_id: post.id,
          user_id: user.id,
          interaction_type: 'share'
        }])

      if (error) throw error

      setShareCount(prev => prev + 1)

      // Try to use native share API
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.profiles?.first_name} ${post.profiles?.last_name}`,
          text: post.content,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link copied',
          description: 'Post link has been copied to clipboard!'
        })
      }
    } catch (error) {
      console.error('Error sharing post:', error)
      toast({
        title: 'Error',
        description: 'Failed to share post. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const reportPost = async () => {
    if (!user) {
      toast({ title: 'Not authenticated', description: 'Please sign in to report posts', variant: 'destructive' })
      return
    }
    try {
      setReporting(true)
      await supabase.from('post_reports').insert([{ post_id: post.id, reporter: user.id, reason: 'Inappropriate' }])
      toast({ title: 'Reported', description: 'Thanks for your report. Our team will review it.' })
    } catch (e) {
      console.error('Error reporting post:', e)
      toast({ title: 'Error', description: 'Failed to report post', variant: 'destructive' })
    } finally {
      setReporting(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Interaction Buttons */}
      <div className="flex items-center gap-6 text-gray-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 hover:text-red-500 ${
            isLiked ? 'text-red-500' : ''
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{likeCount}</span>
        </Button>

        <Dialog open={showComments} onOpenChange={setShowComments}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{commentCount}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Comments List */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar_url} />
                    <AvatarFallback>
                      {comment.profiles?.first_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.profiles?.first_name} {comment.profiles?.last_name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {comment.profiles?.role ? comment.profiles.role.charAt(0).toUpperCase() + comment.profiles.role.slice(1) : 'User'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t pt-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[40px] resize-none"
                    maxLength={500}
                  />
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={isCommenting || !newComment.trim()}
                    className="self-end"
                  >
                    {isCommenting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 hover:text-green-500"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm">{shareCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:text-gray-700"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={reportPost}
          disabled={reporting}
          className="flex items-center gap-2 hover:text-orange-600"
        >
          <Flag className="h-4 w-4" />
          <span className="text-sm">{reporting ? 'Reporting...' : 'Report'}</span>
        </Button>
      </div>

      {/* Media display is handled in the main post component */}
    </div>
  )
}
