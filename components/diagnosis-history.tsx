"use client"

import { useDiagnosisHistory, type DiagnosisResult } from "@/contexts/diagnosis-history-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow, format } from "date-fns"
import { Leaf, Trash2, ChevronRight, AlertCircle } from "lucide-react"
import { useState } from "react"
import { DiagnosisResultEnhanced } from "./diagnosis-result-enhanced"

export function DiagnosisHistory() {
  const { history, clearHistory } = useDiagnosisHistory()
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisResult | null>(null)

  if (history.length === 0) {
    return (
      <Card className="border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-agribeta-green">Diagnosis History</CardTitle>
          <CardDescription>View your previous plant diagnoses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No diagnosis history found</p>
          <p className="text-sm text-muted-foreground">
            Your diagnosis history will appear here after you analyze plant images
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list" onClick={() => setSelectedDiagnosis(null)}>
          History List
        </TabsTrigger>
        <TabsTrigger value="details" disabled={!selectedDiagnosis}>
          Diagnosis Details
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <Card className="border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-agribeta-green">Diagnosis History</CardTitle>
              <CardDescription>View your previous plant diagnoses</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={clearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {history.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedDiagnosis(diagnosis)}
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={diagnosis.image || "/placeholder.svg"}
                        alt={diagnosis.disease}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-agribeta-green" />
                        <h4 className="font-medium text-agribeta-green truncate">{diagnosis.disease}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(diagnosis.timestamp, { addSuffix: true })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(diagnosis.timestamp, "PPP 'at' p")}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        {selectedDiagnosis && (
          <div className="space-y-4">
            <Card className="border-agribeta-green/20 bg-card/90 backdrop-blur-sm overflow-hidden">
              <div className="aspect-video w-full">
                <img
                  src={selectedDiagnosis.image || "/placeholder.svg"}
                  alt={selectedDiagnosis.disease}
                  className="w-full h-full object-contain bg-black/10"
                />
              </div>
            </Card>

            <DiagnosisResultEnhanced result={selectedDiagnosis} timestamp={selectedDiagnosis.timestamp} />
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
