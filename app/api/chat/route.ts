import { type NextRequest, NextResponse } from "next/server"
import { generateGroqAIResponse } from "@/lib/groq-ai"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate a response using Groq AI
    const response = await generateGroqAIResponse(message, {
      model: "llama3-8b-8192",
      temperature: 0.7,
      maxTokens: 1024,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
