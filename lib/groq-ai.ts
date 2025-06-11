interface GroqAIOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  stream?: boolean
}

interface GroqAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function generateGroqAIResponse(prompt: string, options: GroqAIOptions = {}): Promise<string> {
  const { model = "llama3-8b-8192", temperature = 0.7, maxTokens = 1024, topP = 1, stream = false } = options

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an agricultural AI assistant specializing in FCM management for roses and avocado disease diagnosis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stream,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq API error: ${error.error?.message || response.statusText}`)
    }

    const data = (await response.json()) as GroqAIResponse
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error generating Groq AI response:", error)
    throw error
  }
}
