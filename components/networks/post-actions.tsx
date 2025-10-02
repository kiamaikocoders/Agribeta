"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Flag,
  Loader2
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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

interface PostActionsProps {
  post: Post
  onUpdate: () => void
}

export function PostActions({ post, onUpdate }: PostActionsProps) {
  const { user, profile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user?.id === post.user_id
  const isAdmin = profile?.role === 'admin'

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast({
        title: 'Empty content',
        description: 'Post content cannot be empty',
        variant: 'destructive'
      })
      return
    }

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)

      if (error) throw error

      setIsEditing(false)
      onUpdate()
      
      toast({
        title: 'Post updated',
        description: 'Your post has been updated successfully!'
      })
    } catch (error) {
      console.error('Error updating post:', error)
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Delete related interactions first
      await supabase
        .from('post_interactions')
        .delete()
        .eq('post_id', post.id)

      // Delete comments
      await supabase
        .from('comments')
        .delete()
        .eq('post_id', post.id)

      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)

      if (error) throw error

      onUpdate()
      
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
    } finally {
      setIsDeleting(false)
    }
  }

  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const handleReport = async () => {
    try {
      if (!user) return
      if (!reportReason.trim()) {
        toast({ title: 'Add a reason', description: 'Please provide a short reason for reporting.' , variant: 'destructive'})
        return
      }
      const { error } = await supabase
        .from('post_reports')
        .insert([{ post_id: post.id, reporter: user.id, reason: reportReason.trim() }])

      if (error) throw error

      toast({
        title: 'Report submitted',
        description: 'Thank you for reporting this content. We will review it shortly.'
      })
      setReportOpen(false)
      setReportReason('')
    } catch (error) {
      console.error('Error reporting post:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (!isOwner && !isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Flag className="mr-2 h-4 w-4" />
                Report Post
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Post</DialogTitle>
              </DialogHeader>
              <Textarea placeholder="Reason" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
                <Button onClick={handleReport}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
                maxLength={2000}
                placeholder="What's happening in your farm today?"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {editContent.length}/2000
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEdit}
                    disabled={isUpdating || !editContent.trim()}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Post'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Post
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
                All likes, comments, and shares will also be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Post'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!isOwner && (
          <DropdownMenuItem onClick={handleReport}>
            <Flag className="mr-2 h-4 w-4" />
            Report Post
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
