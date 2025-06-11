"use client"

import type React from "react"

import { useState } from "react"
import { useWeather } from "@/contexts/weather-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, RefreshCw } from "lucide-react"

export function LocationSelector() {
  const { location, setLocation, refreshWeather, loading } = useWeather()
  const [inputLocation, setInputLocation] = useState(location)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputLocation.trim()) {
      setLocation(inputLocation.trim())
    }
  }

  const popularLocations = ["Nairobi, Kenya", "Nakuru, Kenya", "Mombasa, Kenya", "Eldoret, Kenya", "Kisumu, Kenya"]

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter location..."
            className="pl-8"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
        <Button type="button" variant="outline" onClick={() => refreshWeather()} disabled={loading}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </form>

      <div>
        <h4 className="text-sm font-medium mb-2">Popular Locations</h4>
        <div className="flex flex-wrap gap-2">
          {popularLocations.map((loc) => (
            <Button
              key={loc}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                setInputLocation(loc)
                setLocation(loc)
              }}
            >
              <MapPin className="h-3 w-3" />
              {loc.split(",")[0]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
