"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { 
  Image as ImageIcon, 
  Video, 
  X, 
  Send, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface MediaFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

interface PostCreatorProps {
  onPostCreated: () => void
}

export function PostCreator({ onPostCreated }: PostCreatorProps) {
  const { user, profile } = useAuth()
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: 'Please select files smaller than 10MB',
          variant: 'destructive'
        })
        return
      }

      const mediaFile: MediaFile = {
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      }

      setMediaFiles(prev => [...prev, mediaFile])
    })
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const uploadMediaFiles = async (): Promise<string[]> => {
    const uploadPromises = mediaFiles.map(async (mediaFile) => {
      const fileExt = mediaFile.file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('post-media')
        .upload(fileName, mediaFile.file)

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(fileName)

      return publicUrl
    })

    return Promise.all(uploadPromises)
  }

  const createPost = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        title: 'Empty post',
        description: 'Please add some content or media to your post',
        variant: 'destructive'
      })
      return
    }

    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to create a post',
        variant: 'destructive'
      })
      return
    }

    setIsPosting(true)

    try {
      let mediaUrls: string[] = []
      let mediaTypes: string[] = []

      if (mediaFiles.length > 0) {
        mediaUrls = await uploadMediaFiles()
        mediaTypes = mediaFiles.map(f => f.type)
      }

      const { error } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          content: content.trim(),
          media_urls: mediaUrls,
          media_types: mediaTypes,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error creating post:', error)
        throw error
      }

      // Clear form
      setContent('')
      setMediaFiles([])
      
      toast({
        title: 'Post created',
        description: 'Your post has been shared successfully!'
      })

      onPostCreated()
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsPosting(false)
    }
  }


  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.first_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.first_name || profile?.email || 'User'
                }
              </h3>
              <Badge variant="outline" className="text-xs">
                {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="What's happening in your farm today? Share your agricultural insights, ask questions, or showcase your crops..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={2000}
          />

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mediaFiles.map((mediaFile, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {mediaFile.type === 'image' ? (
                      <Image
                        src={mediaFile.preview}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={mediaFile.preview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeMediaFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}


          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPosting}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPosting}
              >
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {content.length}/2000
              </span>
              <Button
                onClick={createPost}
                disabled={isPosting || (!content.trim() && mediaFiles.length === 0)}
                className="bg-agribeta-green hover:bg-agribeta-green/90"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
