"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useMessaging } from '@/contexts/messaging-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  ArrowLeft,
  Send, 
  Smile,
  Paperclip,
  CheckCircle,
  CheckCircle2,
  FileText,
  Download,
  Phone,
  Video
} from 'lucide-react'
import { EmojiPicker } from './emoji-picker'
import { OnlineStatus } from './online-status'
import { supabase } from '@/lib/supabaseClient'

interface IndividualChatProps {
  conversationId: string
  onBack: () => void
}

export function IndividualChat({ conversationId, onBack }: IndividualChatProps) {
  const { user } = useAuth()
  const {
    conversations,
    messages,
    sendMessage,
    loading,
    setCurrentConversationById
  } = useMessaging()

  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentConversation = conversations.find(conv => conv.id === conversationId)
  const otherParticipant = currentConversation?.participants.find(p => p.id !== user?.id)

  // Set the current conversation when component mounts
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationById(conversationId)
    }
  }, [conversationId, setCurrentConversationById])

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
    } catch (err) {
      console.error('Error uploading file:', err)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploadingFile(false)
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">Conversation not found</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipant?.avatar_url} />
            <AvatarFallback className="bg-agribeta-green/10 text-agribeta-green">
              {otherParticipant?.first_name?.[0]}{otherParticipant?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <OnlineStatus userId={otherParticipant?.id} />
        </div>
        
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">
            {otherParticipant?.first_name} {otherParticipant?.last_name}
          </h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant={otherParticipant?.role === 'farmer' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {otherParticipant?.role}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area - Takes remaining space */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin h-6 w-6 border-2 border-agribeta-green border-t-transparent rounded-full" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
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
                        className="max-w-full h-auto rounded-lg max-h-64"
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
      <div className="p-4 border-t bg-white flex-shrink-0 transition-all duration-200">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Smile className="h-5 w-5" />
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
              <Paperclip className="h-5 w-5" />
            )}
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-full border-gray-200 focus:border-agribeta-green bg-gray-50 focus:bg-white"
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
