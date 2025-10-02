"use client"

import { useWeather } from "@/contexts/weather-context"
import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LocationSelector } from "@/components/weather/location-selector"
import { AlertTriangle, Droplets, ThermometerSun, Wind, Sun, CloudRain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WeatherDashboard() {
  const { weatherData, loading, error, diseaseRisks, recommendations } = useWeather()
  // State for historical weather
  const [history, setHistory] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)

  // Fetch weather history from Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true)
      const { data, error } = await supabase
        .from('weather_snapshots')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(30)
      if (!error && data) setHistory(data)
      setHistoryLoading(false)
    }
    fetchHistory()
  }, [])

  // Save current weather snapshot to Supabase
  const saveSnapshot = async () => {
    if (!weatherData) return
    setSaving(true)
    const snapshot = {
      location: weatherData.location.name,
      country: weatherData.location.country,
      timestamp: new Date().toISOString(),
      temp_c: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      precip_mm: weatherData.current.precip_mm,
      wind_kph: weatherData.current.wind_kph,
      uv: weatherData.current.uv,
      risks: JSON.stringify(diseaseRisks),
    }
    await supabase.from('weather_snapshots').insert([snapshot])
    setSaving(false)
    // Optionally refetch history
    const { data, error } = await supabase
      .from('weather_snapshots')
      .select('*')
      .order('timestamp', { ascending: true })
      .limit(30)
    if (!error && data) setHistory(data)
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Weather Data Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
          <p className="mt-2">Please try again later or check your internet connection.</p>
        </CardContent>
      </Card>
    )
  }

  const getRiskColor = (risk: number) => {
    if (risk < 30) return "bg-green-500"
    if (risk < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRiskBadge = (risk: number) => {
    if (risk < 30) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>
    if (risk < 70) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Risk</Badge>
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather & Disease Correlation</CardTitle>
          <CardDescription>View current weather conditions and associated disease risks for your crops</CardDescription>
        </CardHeader>
        <CardContent>
          <LocationSelector />
          <div className="mt-4 flex justify-end">
            <Button onClick={saveSnapshot} disabled={saving || !weatherData}>
              {saving ? 'Saving...' : 'Save Weather Snapshot'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Weather & Risk Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weather & Risk Trends</CardTitle>
          <CardDescription>Historical weather and disease risk data (last 30 records)</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div>Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-gray-500">No weather history available. Save a snapshot to begin tracking.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-2 py-1">Time</th>
                    <th className="px-2 py-1">Temp (°C)</th>
                    <th className="px-2 py-1">Humidity (%)</th>
                    <th className="px-2 py-1">Precip (mm)</th>
                    <th className="px-2 py-1">Wind (kph)</th>
                    <th className="px-2 py-1">UV</th>
                    <th className="px-2 py-1">Risks</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((snap) => (
                    <tr key={snap.id} className="border-b">
                      <td className="px-2 py-1">{new Date(snap.timestamp).toLocaleString()}</td>
                      <td className="px-2 py-1">{snap.temp_c}</td>
                      <td className="px-2 py-1">{snap.humidity}</td>
                      <td className="px-2 py-1">{snap.precip_mm}</td>
                      <td className="px-2 py-1">{snap.wind_kph}</td>
                      <td className="px-2 py-1">{snap.uv}</td>
                      <td className="px-2 py-1">
                        {snap.risks && JSON.parse(snap.risks).map((r: any, idx: number) => (
                          <div key={r.disease + '-' + idx}>{r.disease}: {r.risk}%</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Weather</TabsTrigger>
          <TabsTrigger value="risks">Disease Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {loading ? (
                  <Skeleton className="h-8 w-48" />
                ) : weatherData ? (
                  <>
                    Current Weather in {weatherData.location.name}, {weatherData.location.country}
                  </>
                ) : (
                  "Weather Data Unavailable"
                )}
              </CardTitle>
              <CardDescription>
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : weatherData ? (
                  <>Last updated: {new Date(weatherData.location.localtime).toLocaleString()}</>
                ) : (
                  "Please try again later"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : weatherData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <ThermometerSun className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-2xl font-bold">{weatherData.current.temp_c}°C</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Droplets className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <CloudRain className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Precipitation</p>
                        <p className="text-2xl font-bold">{weatherData.current.precip_mm} mm</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Wind className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wind Speed</p>
                        <p className="text-2xl font-bold">{weatherData.current.wind_kph} km/h</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Sun className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">UV Index</p>
                        <p className="text-2xl font-bold">{weatherData.current.uv}</p>
                        <Progress value={weatherData.current.uv * 8.33} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p>No weather data available. Please try again later.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Disease Risk Assessment</CardTitle>
              <CardDescription>
                Current risk levels for common avocado diseases based on weather conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : diseaseRisks ? (
                <div className="space-y-6">
                  {diseaseRisks.map((risk) => (
                    <div key={risk.disease} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{risk.disease}</h4>
                        {getRiskBadge(risk.risk)}
                      </div>
                      <Progress value={risk.risk} className={`h-2 ${getRiskColor(risk.risk)}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No disease risk data available. Please try again later.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather-Based Recommendations</CardTitle>
              <CardDescription>Actionable advice based on current weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <ul className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="bg-orange-100 p-1.5 rounded-full mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-orange-700" />
                      </div>
                      <p>{recommendation}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No specific recommendations at this time. Current weather conditions are favorable for your crops.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
