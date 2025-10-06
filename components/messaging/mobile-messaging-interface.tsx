"use client"

import { useState } from 'react'
import { ConversationsList } from './conversations-list'
import { IndividualChat } from './individual-chat'

export function MobileMessagingInterface() {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setCurrentView('chat')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedConversationId(null)
  }

  if (currentView === 'chat' && selectedConversationId) {
    return (
      <IndividualChat
        conversationId={selectedConversationId}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <ConversationsList
      onSelectConversation={handleSelectConversation}
    />
  )
}
