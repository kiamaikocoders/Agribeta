"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { usePosts, Post } from '@/contexts/posts-context'
import { 
  MessageCircle, 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreVertical,
  Image as ImageIcon,
  Calendar,
  ThumbsUp,
  Reply,
  Trash2,
  Bookmark,
  Flag,
  MoreHorizontal
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { formatDistanceToNow } from 'date-fns'

interface ProfilePostsProps {
  userId?: string
}

export function ProfilePosts({ userId }: ProfilePostsProps) {
  const { user, profile } = useAuth()
  const { posts, loading, createPost, likePost, deletePost, getUserPosts } = usePosts()
  const [newPost, setNewPost] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Check if this is the current user's profile
  const isOwnProfile = !userId || userId === user?.id
  
  // Get posts for the specific user or all posts if viewing own profile
  const userPosts = userId ? getUserPosts(userId) : getUserPosts(user?.id || '')

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return

    setIsCreating(true)
    try {
      await createPost(newPost)
      setNewPost('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">📝 Posts</h3>
          {isOwnProfile && (
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">📝 Posts</h3>
        {isOwnProfile && (
          <Button onClick={() => setShowCreateForm(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        )}
      </div>

      {/* Create Post Form */}
      {showCreateForm && isOwnProfile && (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.first_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {profile?.first_name} {profile?.last_name}
              </p>
              <Badge variant="secondary" className="text-xs">
                {profile?.role}
              </Badge>
            </div>
          </div>
          
          <Textarea
            placeholder="What's on your mind? Share your farming insights, ask questions, or connect with the community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={4}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4" />
                Photo
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePost} 
                disabled={!newPost.trim() || isCreating}
              >
                {isCreating ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {userPosts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isOwnProfile ? 'No posts yet' : 'No posts available'}
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {isOwnProfile 
              ? 'Share your farming insights, ask questions, or connect with the community.'
              : 'This user hasn\'t shared any posts yet.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Post Header */}
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-agribeta-green to-green-600 text-white text-sm">
                        {post.author.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {post.author.first_name} {post.author.last_name}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs font-medium ${
                            post.author.role === 'farmer' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {post.author.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatTimeAgo(post.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
              
              {/* Post Images - Full Width */}
              {post.images && post.images.length > 0 && (
                <div className="mt-2">
                  {post.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-auto"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
                        post.is_liked ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes_count}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.comments_count}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.shares_count}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span className="text-sm font-medium">Save</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isOwnProfile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Flag className="h-4 w-4" />
                        <span className="text-sm">Report</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
