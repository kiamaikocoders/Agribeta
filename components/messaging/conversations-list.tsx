"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useMessaging } from '@/contexts/messaging-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  Search, 
  MessageCircle, 
  Users,
  ArrowLeft,
  Plus
} from 'lucide-react'
import { OnlineStatus } from './online-status'
import { StartConversation } from './start-conversation'

interface ConversationsListProps {
  onSelectConversation: (conversationId: string) => void
}

export function ConversationsList({ onSelectConversation }: ConversationsListProps) {
  const { user } = useAuth()
  const { conversations, loading } = useMessaging()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNewConversation(true)}
          className="bg-agribeta-green hover:bg-agribeta-green/90 text-white rounded-full p-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b bg-white sticky top-[73px] z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white rounded-full"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-6 w-6 border-2 border-agribeta-green border-t-transparent rounded-full" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <MessageCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(p => p.id !== user?.id)
              const lastMessage = conversation.last_message

              return (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 active:bg-gray-100 transition-colors"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParticipant?.avatar_url} />
                      <AvatarFallback className="bg-agribeta-green/10 text-agribeta-green">
                        {otherParticipant?.first_name?.[0]}{otherParticipant?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <OnlineStatus userId={otherParticipant?.id} />
                  </div>
                  
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant?.first_name} {otherParticipant?.last_name}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {lastMessage ? formatTimeAgo(lastMessage.created_at) : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                        <Badge 
                          variant={otherParticipant?.role === 'farmer' ? 'default' : 'secondary'}
                          className="ml-2 text-xs flex-shrink-0"
                        >
                          {otherParticipant?.role}
                        </Badge>
                      </div>
                    </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <StartConversation onClose={() => setShowNewConversation(false)} />
      )}
    </div>
  )
}
