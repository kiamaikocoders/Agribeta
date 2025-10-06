"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send, Bot, User, X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your FCM Management Assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isMinimized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, this would call the Groq API
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate different responses based on keywords in the user's message
      let responseContent = ""
      const lowerCaseInput = input.toLowerCase()

      if (lowerCaseInput.includes("fcm") && lowerCaseInput.includes("regulation")) {
        responseContent =
          "FCM management is regulated under EU regulations 2019/2072 and 2024/2004. These regulations require a systems approach following ISPM 14 international standards, with zero tolerance for FCM pinpointing."
      } else if (lowerCaseInput.includes("monitor") || lowerCaseInput.includes("trap")) {
        responseContent =
          "FCM monitoring should be conducted twice weekly. Install 4 pheromone traps per hectare, check them regularly, and replace lures every 4-6 weeks. Document all findings and report to authorities monthly."
      } else if (lowerCaseInput.includes("greenhouse") || lowerCaseInput.includes("structure")) {
        responseContent =
          "Greenhouse requirements include maintaining structural integrity with no tears in polythene covers, using T7-20 mesh netting on all openings, and implementing double-door systems with self-closing mechanisms."
      } else if (lowerCaseInput.includes("treatment") || lowerCaseInput.includes("control")) {
        responseContent =
          "For FCM control, you can use biological controls like Cryptophlebia leucotreta granulovirus and Beauveria bassiana, or approved pesticides such as Spinetoram, Acephate, Belt, and Coragen. Always follow label rates and rotate pesticide modes of action."
      } else {
        responseContent =
          "I'm here to help with FCM management in roses. You can ask me about regulations, monitoring protocols, greenhouse requirements, pest identification, or control methods. How else can I assist you?"
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error fetching response:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-80 md:w-96 transition-all duration-300 ease-in-out",
        isMinimized ? "h-14" : "h-[500px]",
      )}
    >
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-full bg-agribeta-green hover:bg-agribeta-green/90 text-white rounded-full flex items-center justify-between px-4"
        >
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <span>FCM Management Assistant</span>
          </div>
          <Maximize2 className="h-4 w-4" />
        </Button>
      ) : (
        <Card className="h-full flex flex-col border-agribeta-green">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bot className="h-5 w-5 mr-2 text-agribeta-green" />
              FCM Management Assistant
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(true)}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMessages([messages[0]])}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/agribeta-logo.png" alt="AgriBeta AI" />
                    <AvatarFallback className="bg-agribeta-green text-white">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                    message.role === "user" ? "bg-agribeta-green text-white" : "bg-muted border border-border",
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-agribeta-orange text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask about FCM management..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 border-agribeta-green focus-visible:ring-agribeta-green"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-agribeta-green hover:bg-agribeta-green/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
