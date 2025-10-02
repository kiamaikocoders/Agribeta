"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './auth-context'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: 'text' | 'image' | 'file'
  file_url?: string
  created_at: string
  read_at?: string
  sender?: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
}

interface Conversation {
  id: string
  participant_ids: string[]
  last_message?: Message
  unread_count: number
  participants: Array<{
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    role: string
  }>
  created_at: string
  updated_at: string
}

interface MessagingContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  error: string | null
  sendMessage: (receiverId: string, content: string, type?: 'text' | 'image' | 'file', fileUrl?: string) => Promise<void>
  startConversation: (participantIds: string[]) => Promise<string | null>
  markAsRead: (conversationId: string) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
  refreshConversations: () => Promise<void>
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            user_id,
            profiles:user_id(
              id,
              first_name,
              last_name,
              avatar_url,
              role
            )
          ),
          last_message:messages(
            id,
            sender_id,
            content,
            message_type,
            created_at,
            sender:profiles!messages_sender_id_fkey(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .contains('participant_ids', [user.id])
        .order('updated_at', { ascending: false })

      if (error) throw error

      const formattedConversations = data?.map(conv => ({
        ...conv,
        participants: conv.participants?.map((p: any) => ({
          id: p.user_id,
          ...p.profiles
        })) || [],
        last_message: conv.last_message?.[0] || null,
        unread_count: 0 // TODO: Calculate unread count
      })) || []

      setConversations(formattedConversations)
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    }
  }, [])

  // Send a message
  const sendMessage = useCallback(async (
    receiverId: string, 
    content: string, 
    type: 'text' | 'image' | 'file' = 'text',
    fileUrl?: string
  ) => {
    if (!user || !currentConversation) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation.id,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: type,
          file_url: fileUrl
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      // Add message to local state
      setMessages(prev => [...prev, data])

      // Update conversation's last message and timestamp
      await supabase
        .from('conversations')
        .update({ 
          updated_at: new Date().toISOString(),
          last_message_id: data.id
        })
        .eq('id', currentConversation.id)

      // Create notification for the receiver
      await supabase
        .from('notifications')
        .insert({
          user_id: receiverId,
          type: 'message',
          title: 'New Message',
          message: `You received a message from ${profile?.first_name || 'Someone'}`,
          sender_id: user.id,
          data: {
            conversation_id: currentConversation.id,
            message_id: data.id
          }
        })

      // Refresh conversations to update last message
      await fetchConversations()
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }, [user, profile, currentConversation, fetchConversations])

  // Start a new conversation
  const startConversation = useCallback(async (participantIds: string[]) => {
    if (!user) return null

    try {
      const allParticipants = [...participantIds, user.id]
      
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_ids: allParticipants,
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      // Add participants to conversation
      const participantInserts = allParticipants.map(participantId => ({
        conversation_id: data.id,
        user_id: participantId
      }))

      await supabase
        .from('conversation_participants')
        .insert(participantInserts)

      await fetchConversations()
      return data.id
    } catch (err) {
      console.error('Error starting conversation:', err)
      setError(err instanceof Error ? err.message : 'Failed to start conversation')
      return null
    }
  }, [user, fetchConversations])

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .is('read_at', null)
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }, [user])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        const newMessage = payload.new as Message
        setMessages(prev => [...prev, newMessage])
        
        // Update conversations if this is for the current conversation
        if (currentConversation && newMessage.conversation_id === currentConversation.id) {
          fetchConversations()
        }
      })
      .subscribe()

    // Subscribe to conversation updates
    const conversationsSubscription = supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participant_ids=cs.{${user.id}}`
      }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
      conversationsSubscription.unsubscribe()
    }
  }, [user, currentConversation, fetchConversations])

  // Load conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id)
      markAsRead(currentConversation.id)
    } else {
      setMessages([])
    }
  }, [currentConversation, fetchMessages, markAsRead])

  const value: MessagingContextType = {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    sendMessage,
    startConversation,
    markAsRead,
    setCurrentConversation,
    refreshConversations: fetchConversations
  }

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const context = useContext(MessagingContext)
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider')
  }
  return context
}
