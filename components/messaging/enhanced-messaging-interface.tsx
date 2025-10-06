"use client"

import { useState, useRef, useEffect } from 'react'
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
  CheckCircle,
  CheckCircle2,
  Paperclip,
  Smile,
  FileText,
  Download,
  MoreVertical
} from 'lucide-react'
import { StartConversation } from './start-conversation'
import { EmojiPicker } from './emoji-picker'
import { OnlineStatus } from './online-status'
import { supabase } from '@/lib/supabaseClient'

export function EnhancedMessagingInterface() {
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = async (file: File) => {
    if (!currentConversation || !user) return

    const receiverId = currentConversation.participants.find(p => p.id !== user.id)?.id
    if (!receiverId) return

    setUploadingFile(true)
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `messages/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('message-files')
        .getPublicUrl(filePath)

      // Send message with file
      await sendMessage(receiverId, file.name, file.type.startsWith('image/') ? 'image' : 'file', publicUrl)
      // File upload completed
    } catch (err) {
      console.error('Error uploading file:', err)
    } finally {
      setUploadingFile(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="flex h-full bg-white">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b bg-white flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <StartConversation />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(p => p.id !== user?.id)
            const lastMessage = conversation.last_message
            const isActive = currentConversation?.id === conversation.id

            return (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                  isActive ? 'border-agribeta-green bg-green-50' : 'border-transparent'
                }`}
                onClick={() => setCurrentConversation(conversation)}
              >
                <div className="flex items-center gap-3">
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
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentConversation.participants.find(p => p.id !== user?.id)?.avatar_url} />
                    <AvatarFallback className="bg-agribeta-green/10 text-agribeta-green">
                      {currentConversation.participants.find(p => p.id !== user?.id)?.first_name?.[0]}
                      {currentConversation.participants.find(p => p.id !== user?.id)?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <OnlineStatus userId={currentConversation.participants.find(p => p.id !== user?.id)?.id} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentConversation.participants.find(p => p.id !== user?.id)?.first_name}{' '}
                    {currentConversation.participants.find(p => p.id !== user?.id)?.last_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={currentConversation.participants.find(p => p.id !== user?.id)?.role === 'farmer' ? 'default' : 'secondary'}>
                      {currentConversation.participants.find(p => p.id !== user?.id)?.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Container - Takes remaining space */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
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
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          message.sender_id === user?.id
                            ? 'bg-agribeta-green text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        {message.message_type === 'image' && message.file_url && (
                          <div className="mb-2">
                            <img 
                              src={message.file_url} 
                              alt="Shared image" 
                              className="max-w-full h-auto rounded max-h-64"
                            />
                          </div>
                        )}
                        {message.message_type === 'file' && message.file_url && (
                          <div className="mb-2 p-2 bg-white/20 rounded flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{message.content}</span>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {message.message_type === 'text' && (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {formatMessageTime(message.created_at)}
                          </span>
                          {message.sender_id === user?.id && (
                            <div className="flex items-center">
                              {message.read_at ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
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
            </div>

            {/* Message Input - Fixed at absolute bottom */}
            <div className="p-4 border-t bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Smile className="h-5 w-5 text-gray-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {uploadingFile ? (
                    <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 rounded-full border-gray-200 focus:border-agribeta-green bg-gray-50 focus:bg-white h-10"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  className="bg-agribeta-green hover:bg-agribeta-green/90 text-white rounded-full p-2 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-2">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Select a conversation</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Choose a conversation from the list to start messaging. Or create a new one!
              </p>
            </div>
          </div>
        )}
      </div>


      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  )
}
