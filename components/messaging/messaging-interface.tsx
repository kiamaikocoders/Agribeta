"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useMessaging } from '@/contexts/messaging-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  MessageCircle, 
  Send, 
  Search, 
  Users, 
  Clock,
  CheckCircle,
  CheckCircle2,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react'
import { StartConversation } from './start-conversation'

export function MessagingInterface() {
  const { user, profile } = useAuth()
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    sendMessage,
    setCurrentConversation,
    refreshConversations
  } = useMessaging()

  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return

    const receiverId = currentConversation.participants.find(p => p.id !== user?.id)?.id
    if (!receiverId) return

    try {
      await sendMessage(receiverId, newMessage)
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agribeta-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={refreshConversations} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <CardTitle>Conversations</CardTitle>
              </div>
              <StartConversation />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a conversation with someone!</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(p => p.id !== user?.id)
                  if (!otherParticipant) return null

                  return (
                    <div
                      key={conversation.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                        currentConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setCurrentConversation(conversation)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant.avatar_url} />
                          <AvatarFallback>
                            {otherParticipant.first_name[0]}{otherParticipant.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">
                              {otherParticipant.first_name} {otherParticipant.last_name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {otherParticipant.role}
                              </Badge>
                              {conversation.unread_count > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conversation.unread_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.last_message?.content || 'No messages yet'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {conversation.last_message ? formatTimeAgo(conversation.last_message.created_at) : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  {(() => {
                    const otherParticipant = currentConversation.participants.find(p => p.id !== user?.id)
                    if (!otherParticipant) return null

                    return (
                      <>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant.avatar_url} />
                          <AvatarFallback>
                            {otherParticipant.first_name[0]}{otherParticipant.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {otherParticipant.first_name} {otherParticipant.last_name}
                          </CardTitle>
                          <CardDescription>
                            <Badge variant="secondary" className="text-xs">
                              {otherParticipant.role}
                            </Badge>
                          </CardDescription>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-agribeta-green text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.message_type === 'image' && message.file_url && (
                            <div className="mb-2">
                              <img 
                                src={message.file_url} 
                                alt="Shared image" 
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {formatMessageTime(message.created_at)}
                            </span>
                            {message.sender_id === user?.id && (
                              <div className="flex items-center">
                                {message.read_at ? (
                                  <CheckCircle2 className="h-3 w-3 opacity-70" />
                                ) : (
                                  <CheckCircle className="h-3 w-3 opacity-70" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="bg-agribeta-green hover:bg-agribeta-green/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
