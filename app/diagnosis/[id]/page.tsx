"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/page-background'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Droplets,
  Sun,
  Wind
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface DiagnosisDetail {
  id: string
  user_id: string
  image: string
  disease: string
  confidence: number
  description: string
  treatment: string[]
  prevention_tips: string[]
  created_at: string
  weather_conditions?: {
    temperature: number
    humidity: number
    rainfall: number
    wind_speed: number
  }
  location?: {
    farm_name: string
    coordinates: string
  }
}

export default function DiagnosisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [diagnosis, setDiagnosis] = useState<DiagnosisDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API using params.id
    const mockDiagnosis: DiagnosisDetail = {
      id: params.id as string,
      user_id: 'user123',
      image: '/placeholder.jpg',
      disease: 'Anthracnose',
      confidence: 0.92,
      description: 'Anthracnose is a fungal disease that affects avocado fruits, leaves, and branches. It appears as dark, sunken lesions on fruits and can cause significant crop loss if not managed properly.',
      treatment: [
        'Remove and destroy infected plant parts',
        'Apply copper-based fungicides as a preventative measure',
        'Ensure proper spacing between trees for good air circulation',
        'Avoid overhead irrigation to reduce leaf wetness',
        'Apply systemic fungicides if infection is severe'
      ],
      prevention_tips: [
        'Maintain good orchard hygiene',
        'Prune trees to improve air circulation',
        'Apply preventative fungicides during wet periods',
        'Avoid wounding fruits during harvest',
        'Monitor weather conditions for disease risk'
      ],
      created_at: '2024-01-20T10:30:00Z',
      weather_conditions: {
        temperature: 28,
        humidity: 75,
        rainfall: 15,
        wind_speed: 12
      },
      location: {
        farm_name: 'Green Valley Farm',
        coordinates: '1.2921° S, 36.8219° E'
      }
    }

    setTimeout(() => {
      setDiagnosis(mockDiagnosis)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleDownloadReport = () => {
    // Generate and download PDF report
    alert('Downloading diagnosis report...')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Diagnosis Report - ${diagnosis?.disease}`,
        text: `Plant disease diagnosis: ${diagnosis?.disease} with ${Math.round((diagnosis?.confidence || 0) * 100)}% confidence`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agribeta-green mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading diagnosis details...</p>
              </div>
            </div>
          </div>
        </PageBackground>
      </ProtectedRoute>
    )
  }

  if (!diagnosis) {
    return (
      <ProtectedRoute>
        <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
          <div className="container py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Diagnosis Not Found</h1>
              <p className="text-muted-foreground mb-4">The requested diagnosis could not be found.</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </PageBackground>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Diagnosis History
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-agribeta-green mb-2">
                  Diagnosis Report
                </h1>
                <p className="text-lg text-muted-foreground">
                  Detailed analysis of your plant disease diagnosis
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Disease Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Disease Identification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="relative w-full aspect-square mb-4">
                        <Image
                          src={diagnosis.image}
                          alt="Diagnosed plant"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          {Math.round(diagnosis.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-agribeta-green mb-2">
                          {diagnosis.disease}
                        </h3>
                        <p className="text-muted-foreground">
                          {diagnosis.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(diagnosis.created_at).toLocaleDateString()}
                        </Badge>
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(diagnosis.created_at).toLocaleTimeString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Treatment Plan
                  </CardTitle>
                  <CardDescription>
                    Recommended actions to treat the identified disease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diagnosis.treatment.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prevention Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Prevention Tips
                  </CardTitle>
                  <CardDescription>
                    Measures to prevent future occurrences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diagnosis.prevention_tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather Conditions */}
              {diagnosis.weather_conditions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5" />
                      Weather Conditions
                    </CardTitle>
                    <CardDescription>
                      Environmental factors at time of diagnosis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="font-medium">{diagnosis.weather_conditions.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="font-medium">{diagnosis.weather_conditions.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Rainfall</span>
                      </div>
                      <span className="font-medium">{diagnosis.weather_conditions.rainfall}mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Wind Speed</span>
                      </div>
                      <span className="font-medium">{diagnosis.weather_conditions.wind_speed} km/h</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Info */}
              {diagnosis.location && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Farm Name</span>
                      <p className="font-medium">{diagnosis.location.farm_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Coordinates</span>
                      <p className="font-medium text-sm">{diagnosis.location.coordinates}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Book Agronomist Consultation
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Leaf className="mr-2 h-4 w-4" />
                    View Similar Cases
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Follow-up
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}
