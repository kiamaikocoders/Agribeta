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
  Search, 
  Filter,
  Download,
  Star,
  Eye,
  Share,
  Tag,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Video,
  Image,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function KnowledgeBasePage() {
  const { profile, agronomistProfile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock knowledge base data
  const knowledgeData = {
    articles: [
      {
        id: 1,
        title: "Avocado Disease Management in East Africa",
        category: "Disease Management",
        crop: "Avocado",
        type: "Article",
        description: "Comprehensive guide to identifying and managing common avocado diseases in East African conditions",
        content: "This article covers the most common avocado diseases found in East Africa, including anthracnose, root rot, and bacterial canker...",
        author: "Dr. Sarah Kimani",
        publishDate: "2024-01-15",
        readTime: "8 min",
        views: 245,
        rating: 4.8,
        tags: ["disease", "avocado", "management", "east-africa"],
        isFeatured: true
      },
      {
        id: 2,
        title: "Rose Pest Control Strategies",
        category: "Pest Management",
        crop: "Rose",
        type: "Article",
        description: "Effective strategies for controlling common rose pests including aphids, thrips, and spider mites",
        content: "Rose cultivation in Kenya faces several pest challenges. This guide provides integrated pest management strategies...",
        author: "Dr. Michael Ochieng",
        publishDate: "2024-01-12",
        readTime: "6 min",
        views: 189,
        rating: 4.6,
        tags: ["pest", "rose", "control", "ipm"],
        isFeatured: false
      },
      {
        id: 3,
        title: "Soil Testing and Analysis for Avocado Farms",
        category: "Soil Management",
        crop: "Avocado",
        type: "Guide",
        description: "Step-by-step guide to soil testing and interpretation for optimal avocado production",
        content: "Proper soil analysis is crucial for avocado production. This guide covers sampling techniques, laboratory analysis...",
        author: "Dr. Grace Wanjiku",
        publishDate: "2024-01-10",
        readTime: "12 min",
        views: 156,
        rating: 4.9,
        tags: ["soil", "testing", "avocado", "analysis"],
        isFeatured: true
      }
    ],
    videos: [
      {
        id: 4,
        title: "Avocado Tree Pruning Techniques",
        category: "Cultural Practices",
        crop: "Avocado",
        type: "Video",
        description: "Video demonstration of proper avocado tree pruning techniques for optimal yield",
        duration: "15:30",
        views: 432,
        rating: 4.7,
        author: "Dr. James Mwangi",
        publishDate: "2024-01-08",
        tags: ["pruning", "avocado", "techniques", "yield"]
      },
      {
        id: 5,
        title: "Rose Disease Identification",
        category: "Disease Management",
        crop: "Rose",
        type: "Video",
        description: "Visual guide to identifying common rose diseases in the field",
        duration: "12:45",
        views: 298,
        rating: 4.5,
        author: "Dr. Mary Wanjiku",
        publishDate: "2024-01-05",
        tags: ["disease", "rose", "identification", "visual"]
      }
    ],
    resources: [
      {
        id: 6,
        title: "Avocado Production Calendar",
        category: "Planning",
        crop: "Avocado",
        type: "Resource",
        description: "Monthly calendar for avocado production activities throughout the year",
        fileType: "PDF",
        fileSize: "2.3 MB",
        downloads: 156,
        author: "AgriBeta Team",
        publishDate: "2024-01-03",
        tags: ["calendar", "avocado", "production", "planning"]
      },
      {
        id: 7,
        title: "Rose Disease Photo Gallery",
        category: "Disease Management",
        crop: "Rose",
        type: "Resource",
        description: "High-quality images of rose diseases for easy identification",
        fileType: "Images",
        fileSize: "15.2 MB",
        downloads: 89,
        author: "Dr. Sarah Kimani",
        publishDate: "2024-01-01",
        tags: ["images", "rose", "disease", "identification"]
      }
    ]
  }

  const categories = [
    "All",
    "Disease Management",
    "Pest Management",
    "Soil Management",
    "Cultural Practices",
    "Planning",
    "Fertilization",
    "Harvesting"
  ]

  const types = [
    "All",
    "Article",
    "Video",
    "Guide",
    "Resource"
  ]

  const getCropColor = (crop: string) => {
    switch (crop) {
      case 'Avocado': return 'bg-green-100 text-green-800'
      case 'Rose': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Article': return <FileText className="h-4 w-4" />
      case 'Video': return <Video className="h-4 w-4" />
      case 'Guide': return <BookOpen className="h-4 w-4" />
      case 'Resource': return <Download className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const allContent = [...knowledgeData.articles, ...knowledgeData.videos, ...knowledgeData.resources]

  const filteredContent = allContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-agribeta-green">Knowledge Base</h1>
            <p className="text-muted-foreground">Research, resources, and expert knowledge for avocado and rose farming</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{knowledgeData.articles.length}</div>
              <p className="text-xs text-muted-foreground">Research articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{knowledgeData.videos.length}</div>
              <p className="text-xs text-muted-foreground">Training videos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{knowledgeData.resources.length}</div>
              <p className="text-xs text-muted-foreground">Downloadable files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,320</div>
              <p className="text-xs text-muted-foreground">This month</p>
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
                placeholder="Search knowledge base..."
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
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {types.map(type => (
              <option key={type} value={type === 'All' ? 'all' : type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          {'isFeatured' in item && item.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {'readTime' in item ? item.readTime : 'duration' in item ? item.duration : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {'views' in item ? item.views : 'downloads' in item ? item.downloads : 0} {'views' in item ? 'views' : 'downloads' in item ? 'downloads' : 'interactions'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {'rating' in item ? item.rating : 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getCropColor(item.crop)}>
                            {item.crop}
                          </Badge>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                          <Badge variant="outline">
                            {item.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            by {item.author} • {item.publishDate}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="space-y-4">
              {knowledgeData.articles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4" />
                          <h3 className="text-lg font-semibold">{article.title}</h3>
                          {article.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{article.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {article.rating}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getCropColor(article.crop)}>
                            {article.crop}
                          </Badge>
                          <Badge variant="outline">
                            {article.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            by {article.author} • {article.publishDate}
                          </span>
                          <Button size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Read Article
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {knowledgeData.videos.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{video.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{video.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {video.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getCropColor(video.crop)}>
                        {video.crop}
                      </Badge>
                      <Badge variant="outline">
                        {video.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        by {video.author} • {video.publishDate}
                      </span>
                      <Button size="sm">
                        <Video className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {knowledgeData.resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Download className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{resource.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{resource.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{resource.fileType}</span>
                      <span>{resource.fileSize}</span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.downloads} downloads
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getCropColor(resource.crop)}>
                        {resource.crop}
                      </Badge>
                      <Badge variant="outline">
                        {resource.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        by {resource.author} • {resource.publishDate}
                      </span>
                      <Button size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="space-y-4">
              {allContent.filter(item => 'isFeatured' in item && item.isFeatured).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getCropColor(item.crop)}>
                            {item.crop}
                          </Badge>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                          <Badge variant="outline">
                            {item.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            by {item.author} • {item.publishDate}
                          </span>
                          <Button size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
