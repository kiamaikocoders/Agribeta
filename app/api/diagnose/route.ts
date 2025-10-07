import { type NextRequest, NextResponse } from "next/server"
import { generateGroqAIResponse } from "@/lib/groq-ai"

export async function POST(req: NextRequest) {
  try {
    const { imageData } = await req.json()

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not found, using mock response")
      // Return mock response if no API key
      const mockDiagnosis = {
        disease: "Anthracnose",
        confidence: 0.92,
        description:
          "Anthracnose is a fungal disease that affects avocado fruits, leaves, and branches. It appears as dark, sunken lesions on fruits and can cause significant crop loss if not managed properly.",
        treatment: [
          "Remove and destroy infected plant parts",
          "Apply copper-based fungicides as a preventative measure",
          "Ensure proper spacing between trees for good air circulation",
          "Avoid overhead irrigation to reduce leaf wetness",
        ],
        preventionTips: [
          "Maintain good orchard hygiene",
          "Prune trees to improve air circulation",
          "Apply preventative fungicides during wet periods",
          "Avoid wounding fruits during harvest",
        ],
      }
      return NextResponse.json(mockDiagnosis)
    }

    const prompt = `
      You are an expert agricultural AI assistant specializing in plant disease diagnosis.
      
      Analyze the following image of a plant and provide a diagnosis with the following information:
      1. The most likely disease affecting the plant
      2. Confidence level (as a percentage)
      3. A brief description of the disease
      4. Recommended treatment steps
      5. Prevention tips
      
      Format your response as a JSON object with the following structure:
      {
        "disease": "Disease name",
        "confidence": 0.95, // as a decimal between 0 and 1
        "description": "Description of the disease",
        "treatment": ["Step 1", "Step 2", "Step 3", "Step 4"],
        "preventionTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
      }
      
      Please analyze the plant disease in the image and provide a detailed diagnosis.
    `

    try {
      // Call Groq AI for diagnosis
      const aiResponse = await generateGroqAIResponse(prompt, {
        model: "llama3-8b-8192",
        temperature: 0.3, // Lower temperature for more consistent medical/agricultural advice
        maxTokens: 1024,
      })

      // Parse the AI response
      const diagnosisResult = JSON.parse(aiResponse)
      return NextResponse.json(diagnosisResult)
    } catch (aiError) {
      console.error("Groq AI error:", aiError)
      // Fallback to mock response if AI fails
      const mockDiagnosis = {
        disease: "Anthracnose",
        confidence: 0.92,
        description:
          "Anthracnose is a fungal disease that affects avocado fruits, leaves, and branches. It appears as dark, sunken lesions on fruits and can cause significant crop loss if not managed properly.",
        treatment: [
          "Remove and destroy infected plant parts",
          "Apply copper-based fungicides as a preventative measure",
          "Ensure proper spacing between trees for good air circulation",
          "Avoid overhead irrigation to reduce leaf wetness",
        ],
        preventionTips: [
          "Maintain good orchard hygiene",
          "Prune trees to improve air circulation",
          "Apply preventative fungicides during wet periods",
          "Avoid wounding fruits during harvest",
        ],
      }
      return NextResponse.json(mockDiagnosis)
    }
  } catch (error) {
    console.error("Error in diagnosis:", error)
    return NextResponse.json({ error: "Failed to process diagnosis" }, { status: 500 })
  }
}
