"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Leaf, ShieldCheck, Microscope, Calendar, Download, Share2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import type { DiagnosisResult } from "@/contexts/diagnosis-history-context"

interface DiagnosisResultEnhancedProps {
  result: DiagnosisResult | null
  isLoading?: boolean
  timestamp?: number
  onSave?: () => void
}

export function DiagnosisResultEnhanced({
  result,
  isLoading = false,
  timestamp,
  onSave,
}: DiagnosisResultEnhancedProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <Card className="h-full border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="h-full border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-agribeta-green">Diagnosis Results</CardTitle>
          <CardDescription>Upload or capture an image to see the diagnosis results here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Microscope className="h-16 w-16 mb-4 text-agribeta-green/50" />
          <p className="text-center">
            No image analyzed yet. Please upload or capture an image and click "Analyze Image".
          </p>
        </CardContent>
      </Card>
    )
  }

  const confidenceLevel = result.confidence >= 0.9 ? "High" : result.confidence >= 0.7 ? "Medium" : "Low"

  const confidenceColor =
    result.confidence >= 0.9 ? "text-green-600" : result.confidence >= 0.7 ? "text-amber-500" : "text-red-500"

  const progressColor =
    result.confidence >= 0.9 ? "bg-green-600" : result.confidence >= 0.7 ? "bg-amber-500" : "bg-red-500"

  return (
    <Card className="h-full border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-agribeta-green flex items-center gap-2">
              Diagnosis Results
              {timestamp && (
                <Badge variant="outline" className="ml-2 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(timestamp, { addSuffix: true })}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>AI-powered analysis of your plant</CardDescription>
          </div>
          <Badge
            className={`px-3 py-1 ${
              confidenceColor === "text-green-600"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : confidenceColor === "text-amber-500"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {confidenceLevel} Confidence
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-agribeta-green/10 p-2 rounded-full">
            <Leaf className="h-6 w-6 text-agribeta-green" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-agribeta-green">{result.disease}</h3>
            <div className="mt-2 mb-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span className={confidenceColor}>{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress value={result.confidence * 100} className={`h-2 ${progressColor}`} />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <p className="text-muted-foreground">{result.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-agribeta-green/5 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-agribeta-green mb-1">Severity</h4>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`severity-bar-${i}`}
                      className={`h-2 w-8 mr-1 rounded-sm ${
                        i < Math.ceil(result.confidence * 5) ? "bg-agribeta-green" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-agribeta-orange/5 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-agribeta-orange mb-1">Treatment Urgency</h4>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`urgency-bar-${i}`}
                      className={`h-2 w-8 mr-1 rounded-sm ${
                        i < Math.ceil(result.confidence * 5) ? "bg-agribeta-orange" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="pt-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-agribeta-orange" />
              Treatment Recommendations
            </h4>
            <ul className="space-y-3">
              {result.treatment.map((item, index) => (
                <li key={index} className="bg-agribeta-orange/5 p-3 rounded-lg flex items-start gap-3">
                  <span className="bg-agribeta-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="prevention" className="pt-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-agribeta-green" />
              Prevention Tips
            </h4>
            <ul className="space-y-3">
              {result.preventionTips.map((item, index) => (
                <li key={index} className="bg-agribeta-green/5 p-3 rounded-lg flex items-start gap-3">
                  <span className="bg-agribeta-green text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        {onSave && (
          <Button variant="outline" onClick={onSave} className="text-agribeta-green border-agribeta-green">
            <Download className="mr-2 h-4 w-4" />
            Save Report
          </Button>
        )}

        <Button variant="outline" className="text-agribeta-orange border-agribeta-orange">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </CardFooter>
    </Card>
  )
}
