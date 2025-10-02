"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
// import { PageBackground } from '@/components/page-background'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Search,
  Filter,
  Download,
  Star,
  Eye,
  Share,
  Tag,
  Clock,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function TemplatesPage() {
  const { profile, agronomistProfile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock templates data
  const templatesData = {
    all: [
      {
        id: 1,
        title: "Avocado Anthracnose Treatment",
        category: "Disease Treatment",
        crop: "Avocado",
        description: "Comprehensive treatment plan for avocado anthracnose including fungicide application and cultural practices",
        steps: [
          "Remove and destroy infected plant parts",
          "Apply copper-based fungicides",
          "Ensure proper spacing between trees",
          "Avoid overhead irrigation"
        ],
        duration: "2-3 weeks",
        difficulty: "Intermediate",
        rating: 4.8,
        usageCount: 45,
        isPublic: true,
        createdBy: "Dr. Sarah Kimani",
        lastUsed: "2024-01-15"
      },
      {
        id: 2,
        title: "Rose Black Spot Prevention",
        category: "Prevention",
        crop: "Rose",
        description: "Preventive measures for rose black spot disease including environmental controls and treatment protocols",
        steps: [
          "Maintain good air circulation",
          "Water at the base of plants",
          "Apply preventative fungicides",
          "Remove fallen leaves regularly"
        ],
        duration: "Ongoing",
        difficulty: "Beginner",
        rating: 4.6,
        usageCount: 32,
        isPublic: true,
        createdBy: "Dr. Michael Ochieng",
        lastUsed: "2024-01-12"
      },
      {
        id: 3,
        title: "Avocado Tree Pruning Guide",
        category: "Cultural Practices",
        crop: "Avocado",
        description: "Step-by-step guide for proper avocado tree pruning to improve yield and tree health",
        steps: [
          "Identify dead or diseased branches",
          "Remove water sprouts and suckers",
          "Thin out crowded branches",
          "Shape the tree for optimal light penetration"
        ],
        duration: "1-2 days",
        difficulty: "Advanced",
        rating: 4.9,
        usageCount: 28,
        isPublic: false,
        createdBy: "You",
        lastUsed: "2024-01-10"
      },
      {
        id: 4,
        title: "Rose Pest Identification",
        category: "Pest Management",
        crop: "Rose",
        description: "Identification and treatment of common rose pests including aphids, thrips, and spider mites",
        steps: [
          "Inspect plants regularly for pest signs",
          "Identify pest type and severity",
          "Choose appropriate treatment method",
          "Monitor and follow up as needed"
        ],
        duration: "1 week",
        difficulty: "Intermediate",
        rating: 4.7,
        usageCount: 38,
        isPublic: true,
        createdBy: "Dr. Grace Wanjiku",
        lastUsed: "2024-01-08"
      }
    ],
    myTemplates: [
      {
        id: 5,
        title: "Custom Avocado Fertilization Schedule",
        category: "Fertilization",
        crop: "Avocado",
        description: "Personalized fertilization schedule for avocado trees in Kenyan conditions",
        steps: [
          "Soil testing and analysis",
          "Nitrogen application timing",
          "Phosphorus and potassium requirements",
          "Micronutrient supplementation"
        ],
        duration: "Seasonal",
        difficulty: "Advanced",
        rating: 4.5,
        usageCount: 12,
        isPublic: false,
        createdBy: "You",
        lastUsed: "2024-01-05"
      }
    ]
  }

  const categories = [
    "All",
    "Disease Treatment",
    "Prevention",
    "Cultural Practices",
    "Pest Management",
    "Fertilization",
    "Harvesting",
    "Soil Management"
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCropColor = (crop: string) => {
    switch (crop) {
      case 'Avocado': return 'bg-green-100 text-green-800'
      case 'Rose': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTemplates = templatesData.all.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-agribeta-green">Treatment Templates</h1>
            <p className="text-muted-foreground">Manage and share your treatment protocols</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/templates/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templatesData.all.length}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Templates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templatesData.myTemplates.length}</div>
              <p className="text-xs text-muted-foreground">Created by you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Times used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All' ? 'all' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="my">My Templates</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recently Used</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getCropColor(template.crop)}>
                          {template.crop}
                        </Badge>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {template.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {template.usageCount} uses
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{template.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          by {template.createdBy}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templatesData.myTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getCropColor(template.crop)}>
                          {template.crop}
                        </Badge>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {template.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {template.usageCount} uses
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{template.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Last used: {template.lastUsed}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No favorite templates yet</p>
                  <p className="text-sm text-muted-foreground">Star templates to add them to your favorites</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recently used templates</p>
                  <p className="text-sm text-muted-foreground">Your recently used templates will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
