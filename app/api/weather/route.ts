import { type NextRequest, NextResponse } from "next/server"
import { fetchWeatherData } from "@/services/weather-service"

export async function GET(request: NextRequest) {
  try {
    // Get location from query parameter or default to Nairobi
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get("location") || "Nairobi, Kenya"

    // Fetch weather data using our service
    const weatherData = await fetchWeatherData(location)

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
