import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, AlertTriangle, Leaf, ShieldCheck, Microscope } from "lucide-react"

interface DiagnosisResultProps {
  result: any | null
  isLoading?: boolean
}

export function DiagnosisResult({ result, isLoading = false }: DiagnosisResultProps) {
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

  return (
    <Card className="h-full border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-agribeta-green">Diagnosis Results</CardTitle>
            <CardDescription>AI-powered analysis of your plant</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-agribeta-green/10 text-agribeta-green px-3 py-1 rounded-full">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium">{Math.round(result.confidence * 100)}% Confidence</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-agribeta-green/10 p-2 rounded-full">
            <Leaf className="h-6 w-6 text-agribeta-green" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-agribeta-green">{result.disease}</h3>
            <p className="text-muted-foreground mt-1">{result.description}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-agribeta-orange" /> Treatment Recommendations
          </h4>
          <ul className="space-y-2">
            {result.treatment.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-agribeta-orange/10 text-agribeta-orange rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-agribeta-green" /> Prevention Tips
          </h4>
          <ul className="space-y-2">
            {result.preventionTips.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-agribeta-green/10 text-agribeta-green rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
