"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MessageSquare, ThumbsUp, MessageCircle, Plus } from "lucide-react"

export function ForumPosts() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Best practices for avocado irrigation during dry season",
      content:
        "I'm experiencing challenges with my avocado irrigation during the current dry season. The leaves are starting to curl and I'm concerned about fruit development. What irrigation schedules and techniques are you using to maintain healthy trees during drought conditions?",
      author: "John Doe",
      avatar: "JD",
      date: "2 days ago",
      likes: 15,
      comments: 8,
    },
    {
      id: 2,
      title: "FCM monitoring frequency - is twice weekly enough?",
      content:
        "I've been monitoring for FCM twice weekly as recommended, but I'm wondering if this is sufficient during peak moth activity periods. Has anyone increased their monitoring frequency during certain seasons and seen better results?",
      author: "Sarah Johnson",
      avatar: "SJ",
      date: "5 days ago",
      likes: 7,
      comments: 12,
    },
    {
      id: 3,
      title: "Identifying early signs of anthracnose in avocados",
      content:
        "I'm having trouble distinguishing between early anthracnose symptoms and sunburn on my avocado fruits. Can anyone share clear images or descriptions of what to look for in the early stages of anthracnose infection?",
      author: "Michael Chen",
      avatar: "MC",
      date: "1 week ago",
      likes: 23,
      comments: 15,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="ghost" size="sm">
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
    </div>
  )
}
