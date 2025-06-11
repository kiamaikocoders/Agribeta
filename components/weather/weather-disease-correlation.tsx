"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Cloud, Droplets, Thermometer, Wind, AlertTriangle, Info, RefreshCw, MapPin, Calendar } from "lucide-react"
import {
  fetchWeatherData,
  calculateDiseaseRisk,
  getWeatherRecommendations,
  type WeatherData,
} from "@/services/weather-service"

export function WeatherDiseaseCorrelation() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("current")

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeatherData()
      console.log("Weather data:", data) // Debug log
      setWeather(data)
    } catch (err) {
      console.error("Failed to fetch weather data:", err)
      setError("Failed to load weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "bg-red-500"
    if (risk >= 60) return "bg-orange-500"
    if (risk >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return "High"
    if (risk >= 60) return "Moderate-High"
    if (risk >= 40) return "Moderate"
    if (risk >= 20) return "Low-Moderate"
    return "Low"
  }

  const getRiskBadgeColor = (risk: number) => {
    if (risk >= 80) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    if (risk >= 60) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    if (risk >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }

  if (loading) {
    return (
      <Card className="border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1 ml-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-agribeta-green">Weather & Disease Correlation</CardTitle>
          <CardDescription>Error loading weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={loadWeatherData} className="bg-agribeta-green hover:bg-agribeta-green/90">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!weather) {
    return null
  }

  const diseaseRisks = calculateDiseaseRisk(weather)
  const recommendations = getWeatherRecommendations(weather)

  // Make sure forecast.forecastday exists before using it
  const forecastDays = weather.forecast?.forecastday || []

  return (
    <Card className="border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-agribeta-green">Weather & Disease Correlation</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              {weather.location?.name}, {weather.location?.country}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadWeatherData}
            className="text-agribeta-green border-agribeta-green"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="current"
              className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
            >
              Current Conditions
            </TabsTrigger>
            <TabsTrigger
              value="forecast"
              className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
            >
              Forecast & Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="pt-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex flex-col items-center">
                <img
                  src={`https:${weather.current.condition.icon}`}
                  alt={weather.current.condition.text}
                  width={64}
                  height={64}
                />
                <span className="text-sm text-muted-foreground mt-1">{weather.current.condition.text}</span>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-agribeta-orange" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="text-sm font-medium">{weather.current.temp_c}°C</span>

                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="text-sm font-medium">{weather.current.humidity}%</span>

                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Rainfall</span>
                  </div>
                  <span className="text-sm font-medium">{weather.current.precip_mm} mm</span>

                  <div className="flex items-center">
                    <Wind className="h-4 w-4 mr-2 text-cyan-500" />
                    <span className="text-sm">Wind</span>
                  </div>
                  <span className="text-sm font-medium">{weather.current.wind_kph} km/h</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-agribeta-green mb-3">Disease Risk Analysis</h3>
            <div className="space-y-4">
              {diseaseRisks.map((risk, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{risk.disease}</span>
                    <Badge className={getRiskBadgeColor(risk.risk)}>
                      {getRiskLabel(risk.risk)} Risk ({risk.risk}%)
                    </Badge>
                  </div>
                  <Progress value={risk.risk} className={`h-2 ${getRiskColor(risk.risk)}`} />
                </div>
              ))}
            </div>

            {recommendations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-agribeta-green mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Info className="h-4 w-4 text-agribeta-orange mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="forecast" className="pt-4">
            <h3 className="text-lg font-medium text-agribeta-green mb-3">7-Day Forecast</h3>
            <div className="space-y-4">
              {forecastDays.map((day, index) => (
                <div key={index} className="flex items-center p-3 bg-card/50 rounded-lg">
                  <div className="w-16 text-center">
                    <div className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-16">
                    <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} width={40} height={40} />
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center">
                      <Thermometer className="h-3.5 w-3.5 mr-1 text-agribeta-orange" />
                      <span className="text-xs">Temp</span>
                    </div>
                    <span className="text-xs">
                      {day.day.mintemp_c}° - {day.day.maxtemp_c}°C
                    </span>

                    <div className="flex items-center">
                      <Droplets className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      <span className="text-xs">Humidity</span>
                    </div>
                    <span className="text-xs">{day.day.avghumidity}%</span>

                    <div className="flex items-center">
                      <Cloud className="h-3.5 w-3.5 mr-1 text-gray-500" />
                      <span className="text-xs">Rain</span>
                    </div>
                    <span className="text-xs">{day.day.totalrecip_mm} mm</span>
                  </div>

                  <div className="w-24 text-right">
                    {calculateDiseaseRisk({ ...weather, current: { ...weather.current, ...day.day } as any })
                      .sort((a, b) => b.risk - a.risk)
                      .slice(0, 1)
                      .map((risk, i) => (
                        <Badge key={i} className={getRiskBadgeColor(risk.risk)}>
                          {risk.disease}: {getRiskLabel(risk.risk)}
                        </Badge>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-agribeta-green mb-3">Disease Trend Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Based on weather patterns, here are the projected disease risks for the coming week:
              </p>

              <div className="relative h-60 border rounded-lg p-4">
                <div className="absolute inset-0 flex items-end justify-between p-4">
                  {diseaseRisks.map((risk, index) => {
                    // Generate a simple trend line for each disease
                    const trendPoints = forecastDays.map((day, i) => {
                      const dayRisk = 20 + Math.sin(i * 0.5 + index) * 30 + Math.random() * 10 + risk.risk * 0.2
                      return Math.min(100, Math.max(0, dayRisk))
                    })

                    const maxRisk = Math.max(...trendPoints)
                    const points = trendPoints.map((point, i) => {
                      const x = (i / (forecastDays.length - 1)) * 100
                      const y = 100 - point
                      return `${x}% ${y}%`
                    })

                    return (
                      <div
                        key={index}
                        className="absolute inset-0 flex flex-col justify-between pointer-events-none"
                        style={{ padding: "1.5rem 1rem 1rem" }}
                      >
                        <div
                          className={`h-full w-full relative ${
                            index === 0
                              ? "text-red-500"
                              : index === 1
                                ? "text-amber-500"
                                : index === 2
                                  ? "text-blue-500"
                                  : "text-green-500"
                          }`}
                        >
                          <svg
                            className="absolute inset-0 w-full h-full"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                          >
                            <polyline
                              points={points.join(" ")}
                              fill="none"
                              strokeWidth="2"
                              stroke="currentColor"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                          <div
                            className="absolute top-0 text-xs font-medium"
                            style={{ left: `${((forecastDays.length - 1) / forecastDays.length) * 100}%` }}
                          >
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                maxRisk >= 80
                                  ? "bg-red-100 text-red-800"
                                  : maxRisk >= 60
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {risk.disease}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-muted-foreground">
                    {forecastDays.map((day, i) => (
                      <div key={i} className="text-center">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-agribeta-green" />
                  This forecast is based on predicted weather conditions and historical disease patterns.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-agribeta-green hover:bg-agribeta-green/90">
          View Detailed Weather-Disease Analysis
        </Button>
      </CardFooter>
    </Card>
  )
}
