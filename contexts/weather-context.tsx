"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type WeatherData, calculateDiseaseRisk, getWeatherRecommendations } from "@/services/weather-service"

interface WeatherContextType {
  weatherData: WeatherData | null
  loading: boolean
  error: string | null
  location: string
  setLocation: (location: string) => void
  refreshWeather: () => Promise<void>
  diseaseRisks: Array<{ disease: string; risk: number }> | null
  recommendations: string[] | null
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<string>("Nairobi, Kenya")
  const [diseaseRisks, setDiseaseRisks] = useState<Array<{ disease: string; risk: number }> | null>(null)
  const [recommendations, setRecommendations] = useState<string[] | null>(null)

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Weather data from API:", data) // Debug log
      setWeatherData(data)

      // Calculate disease risks and recommendations
      if (data) {
        setDiseaseRisks(calculateDiseaseRisk(data))
        setRecommendations(getWeatherRecommendations(data))
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error)
      setError("Failed to fetch weather data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather data on initial load and when location changes
  useEffect(() => {
    fetchWeather()

    // Set up auto-refresh every 30 minutes
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [location])

  const refreshWeather = async () => {
    await fetchWeather()
  }

  const value = {
    weatherData,
    loading,
    error,
    location,
    setLocation,
    refreshWeather,
    diseaseRisks,
    recommendations,
  }

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}
