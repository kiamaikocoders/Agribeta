"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMessaging } from '@/contexts/messaging-context'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Search, Users, X } from 'lucide-react'

interface User {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  role: string
  farm_name?: string
  company?: string
}

interface StartConversationProps {
  onClose?: () => void
}

export function StartConversation({ onClose }: StartConversationProps) {
  const { user } = useAuth()
  const { startConversation, setCurrentConversation } = useMessaging()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role, farm_name, company')
        .neq('id', user.id) // Exclude current user
        .order('first_name')

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open, user])

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartConversation = async (targetUser: User) => {
    if (!user) return

    try {
      const conversationId = await startConversation([targetUser.id])
      if (conversationId) {
        // Find the conversation and set it as current
        // This will be handled by the messaging context
        setOpen(false)
        setSearchQuery('')
        setSelectedUser(null)
        onClose?.()
      }
    } catch (err) {
      console.error('Error starting conversation:', err)
    }
  }

  // If onClose is provided, render as modal overlay (for mobile)
  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Start New Conversation</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Search for farmers or agronomists to start a conversation with.
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Users List */}
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-agribeta-green mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>No users found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </div>
                ) : (
                  filteredUsers.map((targetUser) => (
                    <div
                      key={targetUser.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
                      onClick={() => handleStartConversation(targetUser)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={targetUser.avatar_url} />
                        <AvatarFallback>
                          {targetUser.first_name[0]}{targetUser.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">
                            {targetUser.first_name} {targetUser.last_name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {targetUser.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {targetUser.farm_name || targetUser.company || 'No organization'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default dialog version (for desktop)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-agribeta-green hover:bg-agribeta-green/90 text-white">
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Search for farmers or agronomists to start a conversation with.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-agribeta-green mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>No users found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            ) : (
              filteredUsers.map((targetUser) => (
                <div
                  key={targetUser.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
                  onClick={() => handleStartConversation(targetUser)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={targetUser.avatar_url} />
                    <AvatarFallback>
                      {targetUser.first_name[0]}{targetUser.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {targetUser.first_name} {targetUser.last_name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {targetUser.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {targetUser.farm_name || targetUser.company || 'No organization'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
