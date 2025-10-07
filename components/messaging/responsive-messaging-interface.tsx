"use client"

import { useState, useEffect } from 'react'
import { ConversationsList } from './conversations-list'
import { IndividualChat } from './individual-chat'
import { EnhancedMessagingInterface } from './enhanced-messaging-interface'

export function ResponsiveMessagingInterface() {
  const [isMobile, setIsMobile] = useState(false)
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  // Check if we're on mobile based on screen width
  useEffect(() => {
    const checkIsMobile = () => {
      // Use lg breakpoint (1024px) for the switch
      setIsMobile(window.innerWidth < 1024)
    }

    // Check on mount
    checkIsMobile()

    // Listen for resize events with debouncing
    let timeoutId: NodeJS.Timeout
    const debouncedCheck = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkIsMobile, 100)
    }

    window.addEventListener('resize', debouncedCheck)
    return () => {
      window.removeEventListener('resize', debouncedCheck)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setCurrentView('chat')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedConversationId(null)
  }

  // For mobile: Use Instagram-style navigation
  if (isMobile) {
    if (currentView === 'chat' && selectedConversationId) {
      return (
        <div className="transition-all duration-300 ease-in-out">
          <IndividualChat
            conversationId={selectedConversationId}
            onBack={handleBackToList}
          />
        </div>
      )
    }

    return (
      <div className="transition-all duration-300 ease-in-out">
        <ConversationsList
          onSelectConversation={handleSelectConversation}
        />
      </div>
    )
  }

  // For desktop: Use traditional side-by-side layout
  console.log('Rendering desktop view')
  return (
    <div className="transition-all duration-300 ease-in-out">
      <EnhancedMessagingInterface />
    </div>
  )
}
