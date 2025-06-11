"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface WeatherErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function WeatherErrorFallback({ error, resetErrorBoundary }: WeatherErrorFallbackProps) {
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
          <AlertDescription>{error.message || "Failed to load weather data. Please try again."}</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button onClick={resetErrorBoundary} className="bg-agribeta-green hover:bg-agribeta-green/90">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardFooter>
    </Card>
  )
}
