import type { Metadata } from "next"
import { WeatherDashboard } from "@/components/weather/weather-dashboard"

export const metadata: Metadata = {
  title: "Weather Data | AgriBeta",
  description: "Weather data and disease correlation for agricultural management",
}

export default function WeatherPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Weather & Disease Correlation</h1>
        <p className="text-muted-foreground">
          Monitor weather conditions and understand how they affect plant disease risks
        </p>
      </div>

      <WeatherDashboard />
    </div>
  )
}
