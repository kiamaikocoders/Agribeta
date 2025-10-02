"use client"

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageBackground } from '@/components/page-background'
import { Search, BookOpen, Clock, Users, Star, Play, Calendar, Award } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function ProgramsPage() {
  const [enrolledPrograms, setEnrolledPrograms] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const handleEnroll = (programId: string, programTitle: string) => {
    setEnrolledPrograms(prev => new Set([...prev, programId]))
    toast({
      title: "Enrollment Successful",
      description: `You have successfully enrolled in ${programTitle}`,
    })
  }

  const handlePreview = (programTitle: string) => {
    toast({
      title: "Program Preview",
      description: `Preview for ${programTitle} will be available soon.`,
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real app, this would filter the programs
    toast({
      title: "Search",
      description: `Searching for programs matching "${query}"`,
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    toast({
      title: "Filter Applied",
      description: `Filtering by category: ${category}`,
    })
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    toast({
      title: "Filter Applied",
      description: `Filtering by level: ${level}`,
    })
  }

  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Learning Programs</h1>
            <p className="text-lg text-muted-foreground">Master agricultural techniques with our expert-led programs</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search programs by title, topic, or instructor..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="avocado">Avocado Farming</SelectItem>
                      <SelectItem value="roses">Rose Cultivation</SelectItem>
                      <SelectItem value="pest-management">Pest Management</SelectItem>
                      <SelectItem value="soil-health">Soil Health</SelectItem>
                      <SelectItem value="irrigation">Irrigation Systems</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={handleLevelChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Program Card 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <Badge className="absolute top-4 right-4 bg-agribeta-orange text-white">
                  Featured
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Avocado Farming Masterclass</CardTitle>
                <CardDescription>Complete guide to successful avocado cultivation</CardDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>8 weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>1,234 enrolled</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">4.9 (89 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Next start: June 1, 2025</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-agribeta-green hover:bg-agribeta-green/90"
                    onClick={() => handleEnroll('avocado-masterclass', 'Avocado Farming Masterclass')}
                    disabled={enrolledPrograms.has('avocado-masterclass')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {enrolledPrograms.has('avocado-masterclass') ? 'Enrolled' : 'Enroll Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview('Avocado Farming Masterclass')}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Program Card 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                  New
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Rose Cultivation Excellence</CardTitle>
                <CardDescription>Professional rose farming techniques</CardDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>6 weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>567 enrolled</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">4.8 (67 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Next start: May 15, 2025</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-agribeta-green hover:bg-agribeta-green/90"
                    onClick={() => handleEnroll('rose-cultivation', 'Rose Cultivation Techniques')}
                    disabled={enrolledPrograms.has('rose-cultivation')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {enrolledPrograms.has('rose-cultivation') ? 'Enrolled' : 'Enroll Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview('Rose Cultivation Techniques')}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Program Card 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <Badge className="absolute top-4 right-4 bg-purple-500 text-white">
                  Advanced
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Integrated Pest Management</CardTitle>
                <CardDescription>Advanced pest control strategies</CardDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>10 weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>234 enrolled</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">4.7 (45 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Next start: July 1, 2025</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-agribeta-green hover:bg-agribeta-green/90"
                    onClick={() => handleEnroll('pest-management', 'Advanced Pest Management')}
                    disabled={enrolledPrograms.has('pest-management')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {enrolledPrograms.has('pest-management') ? 'Enrolled' : 'Enroll Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview('Advanced Pest Management')}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Instructor */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-agribeta-green mb-2">Learn from Experts</h3>
                    <p className="text-muted-foreground mb-4">
                      Our programs are designed and taught by certified agronomists with years of practical experience
                    </p>
                    <Button className="bg-agribeta-orange hover:bg-agribeta-orange/90">
                      View All Instructors
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-agribeta-green rounded-full mb-4">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Certified Programs</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn certificates recognized by agricultural institutions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-agribeta-orange rounded-full mb-4">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Community Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with fellow farmers and share experiences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}


