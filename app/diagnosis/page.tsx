"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, Upload, Loader2, AlertCircle, History, CloudSun } from "lucide-react"
import { ImageUploader } from "@/components/image-uploader"
import { CameraCapture } from "@/components/camera-capture"
import { DiagnosisResultEnhanced } from "@/components/diagnosis-result-enhanced"
import { DiagnosisHistory } from "@/components/diagnosis-history"
import { WeatherDiseaseCorrelation } from "@/components/weather/weather-disease-correlation"
import { ErrorBoundary } from "@/components/error-boundary"
import { useDiagnosisHistory } from "@/contexts/diagnosis-history-context"
import { preprocessImage } from "@/utils/image-preprocessing"
import { useAuth } from "@/contexts/auth-context"
import { useUsage } from "@/hooks/use-usage"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function DiagnosisPage() {
  const [activeTab, setActiveTab] = useState<"new" | "history" | "weather">("new")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPreprocessing, setIsPreprocessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const { addDiagnosis } = useDiagnosisHistory()
  const { user, profile } = useAuth()
  const { usage, canUseService, trackUsage } = useUsage()

  const handleImageCapture = async (imageData: string) => {
    setSelectedImage(imageData)
    setProcessedImage(null)
    setError(null)
    setResult(null)

    try {
      setIsPreprocessing(true)
      const processed = await preprocessImage(imageData)
      setProcessedImage(processed)
    } catch (err) {
      console.error("Image preprocessing failed:", err)
      setError("Image preprocessing failed. Using original image.")
      setProcessedImage(imageData)
    } finally {
      setIsPreprocessing(false)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage || !user) {
      setError("Please select or capture an image first")
      return
    }

    // Check usage limits
    if (!canUseService('ai_prediction')) {
      setError("You've reached your AI prediction limit. Please upgrade your plan to continue.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Use the processed image if available, otherwise use the original
      const imageToAnalyze = processedImage || selectedImage

      // Simulate API call to Groq AI
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock result for demonstration
      const diagnosisResult = {
        disease: "Anthracnose",
        confidence: 0.92,
        description:
          "Anthracnose is a fungal disease that affects avocado fruits, leaves, and branches. It appears as dark, sunken lesions on fruits and can cause significant crop loss if not managed properly.",
        treatment: [
          "Remove and destroy infected plant parts",
          "Apply copper-based fungicides as a preventative measure",
          "Ensure proper spacing between trees for good air circulation",
          "Avoid overhead irrigation to reduce leaf wetness",
        ],
        preventionTips: [
          "Maintain good orchard hygiene",
          "Prune trees to improve air circulation",
          "Apply preventative fungicides during wet periods",
          "Avoid wounding fruits during harvest",
        ],
      }

      // Save diagnosis to database with user tracking
      const { error: dbError } = await supabase
        .from('diagnosis_results')
        .insert([{
          user_id: user.id,
          image: imageToAnalyze,
          disease: diagnosisResult.disease,
          confidence: diagnosisResult.confidence,
          description: diagnosisResult.description,
          treatment: diagnosisResult.treatment,
          prevention_tips: diagnosisResult.preventionTips,
          crop_type: 'Avocado', // Since this is the avocado diagnosis page
        }])

      if (dbError) {
        console.error('Error saving diagnosis:', dbError)
      }

      // Track usage with the new usage system
      const usageResult = await trackUsage('ai_prediction', 1)
      if (!usageResult.success) {
        console.error('Error tracking usage:', usageResult.error)
      }

      setResult(diagnosisResult)

      // Add to history
      addDiagnosis({
        ...diagnosisResult,
        image: imageToAnalyze,
      })
    } catch (err) {
      setError("Failed to analyze the image. Please try again.")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetDiagnosis = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setResult(null)
    setError(null)
  }

  return (
    <ProtectedRoute>
    <ErrorBoundary>
      <div className="relative min-h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/greenhouse-robotics.png"
            alt="Greenhouse Robotics"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>

        <div className="relative z-10 container py-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-agribeta-green">
              Avocado Disease Diagnosis
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              Upload or capture an image of your avocado plant to diagnose potential diseases.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "new" | "history" | "weather")}
            className="w-full mb-8"
          >
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger
                  value="new"
                  className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
                >
                  New Diagnosis
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="weather"
                  className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
                >
                  <CloudSun className="mr-2 h-4 w-4" />
                  Weather
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {activeTab === "new" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="h-full border-agribeta-green/20 bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-agribeta-green">Image Input</CardTitle>
                    <CardDescription>Upload an image or take a photo of the affected plant part</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!result ? (
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger
                            value="upload"
                            className="flex items-center data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </TabsTrigger>
                          <TabsTrigger
                            value="camera"
                            className="flex items-center data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="mt-4">
                          <ImageUploader onImageCapture={handleImageCapture} />
                        </TabsContent>
                        <TabsContent value="camera" className="mt-4">
                          <CameraCapture onImageCapture={handleImageCapture} />
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-md aspect-square mb-4">
                          <img
                            src={processedImage || selectedImage || ""}
                            alt="Analyzed plant"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute top-2 right-2 bg-agribeta-green/20 text-agribeta-green rounded-full px-2 py-1 text-xs font-medium flex items-center">
                            Analyzed
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={resetDiagnosis}
                          className="border-agribeta-green text-agribeta-green hover:bg-agribeta-green/10"
                        >
                          Upload New Image
                        </Button>
                      </div>
                    )}

                    {isPreprocessing && (
                      <Alert className="mt-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertTitle>Processing Image</AlertTitle>
                        <AlertDescription>Enhancing image for better diagnosis accuracy...</AlertDescription>
                      </Alert>
                    )}

                    {error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Usage Limit Warning */}
                    {usage && !canUseService('ai_prediction') && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Usage Limit Reached</AlertTitle>
                        <AlertDescription>
                          You've used {usage.ai_predictions.used}/{usage.ai_predictions.limit === -1 ? '∞' : usage.ai_predictions.limit} AI predictions this month.
                          <Link href="/billing" className="ml-2 text-agribeta-green hover:underline">
                            Upgrade your plan
                          </Link> to continue.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Usage Status */}
                    {usage && canUseService('ai_prediction') && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Usage Status</AlertTitle>
                        <AlertDescription>
                          {usage.ai_predictions.remaining === -1 
                            ? 'Unlimited AI predictions available'
                            : `${usage.ai_predictions.remaining} AI predictions remaining this month`
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter
                    className={cn("flex justify-center", {
                      "opacity-50 pointer-events-none": !selectedImage || isAnalyzing || isPreprocessing || result,
                    })}
                  >
                    <Button
                      onClick={analyzeImage}
                      disabled={!selectedImage || isAnalyzing || isPreprocessing || !!result || !canUseService('ai_prediction')}
                      className="w-full bg-agribeta-green hover:bg-agribeta-green/90"
                    >
                      {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <DiagnosisResultEnhanced
                  result={result}
                  isLoading={isAnalyzing}
                  onSave={() => {
                    // Handle saving report
                    alert("Report saved successfully!")
                  }}
                />
              </div>
            </div>
          ) : activeTab === "history" ? (
            <DiagnosisHistory />
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <WeatherDiseaseCorrelation />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
    </ProtectedRoute>
  )
}
