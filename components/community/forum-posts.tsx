"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MessageSquare, ThumbsUp, MessageCircle, Plus } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@supabase/supabase-js';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
  media_urls: string[];
}

export function ForumPosts() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openCommentsPostId, setOpenCommentsPostId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('forum_posts').select('*').order('date', { ascending: false })
      if (!error && data) setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Real-time subscription for comments
  useEffect(() => {
    const commentsChannel = supabase
      .channel('comments-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, payload => {
        const newComment = payload.new;
        // Update comment count for the relevant post
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === newComment.post_id
            ? { ...post, comments: post.comments + 1 }
            : post
        ));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  // Real-time subscription for likes (optional)
  useEffect(() => {
    const likesChannel = supabase
      .channel('likes-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'forum_posts' }, payload => {
        const updatedPost = payload.new;
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === updatedPost.id
            ? { ...post, likes: updatedPost.likes }
            : post
        ));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setErrorMsg(null)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('forum-media').upload(fileName, file)
    if (error) {
      setErrorMsg('Failed to upload media. Please ensure the forum-media bucket exists and is public.');
      setUploading(false)
      return
    }
    const { data: publicUrlData } = supabase.storage.from('forum-media').getPublicUrl(fileName)
    setNewPostMedia(publicUrlData?.publicUrl || null)
    setUploading(false)
  }

  const handlePostSubmit = async () => {
    setErrorMsg(null)
    if (!newPostContent.trim() && !newPostMedia) {
      setErrorMsg('Post cannot be empty.');
      return;
    }
    const { data, error } = await supabase.from('forum_posts').insert([
      {
        title: 'Untitled',
        content: newPostContent,
        author: 'Anonymous',
        avatar: 'A',
        date: new Date().toISOString(),
        likes: 0,
        comments: 0,
        media_urls: newPostMedia ? [newPostMedia] : [],
      },
    ])
    if (error) {
      setErrorMsg('Failed to post. Please try again.');
      return;
    }
    setNewPostContent("")
    setNewPostMedia(null)
    const { data: newPosts } = await supabase.from('forum_posts').select('*').order('date', { ascending: false })
    setPosts(newPosts || [])
  }

  // Handler for liking a post
  const handleLike = async (postId: number) => {
    // Find the post
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    // Update likes in Supabase
    const { error } = await supabase.from('forum_posts').update({ likes: post.likes + 1 }).eq('id', postId);
    if (!error) {
      // Update UI
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  // Comment modal component
  function CommentModal({ postId, onClose }: { postId: number, onClose: () => void }) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [newCommentMedia, setNewCommentMedia] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const commentFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
        if (!error && data) setComments(data);
        setLoading(false);
      };
      fetchComments();
    }, [postId]);

    // Real-time subscription for comments for this post
    useEffect(() => {
      const channel = supabase
        .channel(`comments-changes-${postId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, payload => {
          setComments(prev => [...prev, payload.new]);
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }, [postId]);

    // Handler for comment media upload
    const handleCommentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `comment-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('forum-media').upload(fileName, file);
      if (error) {
        alert('Failed to upload media');
        setUploading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('forum-media').getPublicUrl(fileName);
      setNewCommentMedia(publicUrlData?.publicUrl || null);
      setUploading(false);
    };

    // Handler for adding a comment
    const handleAddComment = async () => {
      if (!newComment.trim() && !newCommentMedia) return;
      const { error } = await supabase.from('comments').insert([
        {
          post_id: postId,
          author: 'Anonymous',
          content: newComment,
          media_urls: newCommentMedia ? [newCommentMedia] : [],
        },
      ]);
      if (!error) {
        setNewComment("");
        setNewCommentMedia(null);
        // Refetch comments
        const { data: newComments } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
        setComments(newComments || []);
      }
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {loading ? (
              <div>Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-gray-500">No comments yet.</div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-medium text-gray-700">{comment.author}</div>
                  <div className="text-gray-600 mt-1">{comment.content}</div>
                  {comment.media_urls && comment.media_urls.length > 0 && (
                    <img
                      src={comment.media_urls[0]}
                      alt="Comment Media"
                      className="mt-2 rounded-lg max-h-40 w-auto object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-grow p-2 border border-gray-300 rounded-lg"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={commentFileInputRef}
              onChange={handleCommentFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => commentFileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Attach Media'}
            </Button>
            <Button
              type="button"
              className="bg-[#167539] text-white"
              onClick={handleAddComment}
              disabled={uploading || (!newComment.trim() && !newCommentMedia)}
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-[#167539]/20">
        <h3 className="text-xl font-bold text-[#167539] mb-2">Share with the Agribeta Community</h3>
        {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#167539]"
          placeholder="Share something with the community..."
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
        ></textarea>
        <div className="flex items-center mt-4 space-x-4">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Image/Video'}
          </Button>
          {newPostMedia && (
            <span className="text-green-700">Media attached</span>
          )}
          <Button
            type="button"
            className="bg-[#167539] text-white"
            onClick={handlePostSubmit}
            disabled={uploading || (!newPostContent.trim() && !newPostMedia)}
          >
            Post
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Input placeholder="Search discussions..." className="max-w-md" />
        <Button variant="outline">Search</Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{post.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
              <CardDescription>
                <div className="flex items-center mt-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{post.avatar}</AvatarFallback>
                  </Avatar>
                  <span>
                    {post.author} • {post.date}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">{post.content}</p>
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="mt-4">
                  {post.media_urls[0].match(/\.(mp4|mov)$/i) ? (
                    <video controls className="w-full max-h-80 rounded-lg">
                      <source src={post.media_urls[0]} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.media_urls[0]}
                      alt="Post Media"
                      className="w-full max-h-80 rounded-lg object-cover"
                    />
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpenCommentsPostId(post.id)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment
              </Button>
              <Button variant="outline" size="sm">
                View Discussion
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More</Button>
      </div>

      {/* Comment Modal */}
      {openCommentsPostId && (
        <CommentModal postId={openCommentsPostId} onClose={() => setOpenCommentsPostId(null)} />
      )}
    </div>
  )
}
