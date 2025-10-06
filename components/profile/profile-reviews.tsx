"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { 
  Star, 
  MessageCircle, 
  Calendar, 
  ThumbsUp, 
  Filter,
  SortAsc,
  Award,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  client_id: string
  agronomist_id: string
  created_at: string
  consultation_type: 'diagnosis' | 'consultation' | 'advice' | 'other'
  helpful_count: number
  is_verified: boolean
  client: {
    first_name: string
    last_name: string
    avatar_url: string
    role: string
    is_verified: boolean
  }
  consultation: {
    id: string
    subject: string
    duration: number
    date: string
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  consultationTypes: {
    diagnosis: number
    consultation: number
    advice: number
    other: number
  }
  recentTrend: 'up' | 'down' | 'stable'
}

interface ProfileReviewsProps {
  userId?: string
}

export function ProfileReviews({ userId }: ProfileReviewsProps) {
  const { user, profile } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [sortBy, filterBy])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      
      // Mock reviews data - in a real app, this would come from your reviews API
      const mockReviews: Review[] = [
        {
          id: '1',
          rating: 5,
          title: 'Excellent pest management advice!',
          content: 'Dr. Zachariah provided incredibly detailed advice on managing aphids in my tomato greenhouse. His recommendations were practical and effective. I saw results within a week! Highly recommend his consultation services.',
          client_id: 'client1',
          agronomist_id: user?.id || '',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          consultation_type: 'consultation',
          helpful_count: 8,
          is_verified: true,
          client: {
            first_name: 'John',
            last_name: 'Doe',
            avatar_url: '',
            role: 'farmer',
            is_verified: true
          },
          consultation: {
            id: 'consult1',
            subject: 'Pest Management for Tomatoes',
            duration: 60,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '2',
          rating: 5,
          title: 'Outstanding crop diagnosis',
          content: 'I was struggling with my avocado trees showing signs of disease. Dr. Zachariah quickly identified it as root rot and provided a comprehensive treatment plan. My trees are now healthy and thriving!',
          client_id: 'client2',
          agronomist_id: user?.id || '',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          consultation_type: 'diagnosis',
          helpful_count: 12,
          is_verified: true,
          client: {
            first_name: 'Sarah',
            last_name: 'Wilson',
            avatar_url: '',
            role: 'farmer',
            is_verified: true
          },
          consultation: {
            id: 'consult2',
            subject: 'Avocado Tree Disease Diagnosis',
            duration: 45,
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '3',
          rating: 4,
          title: 'Great irrigation advice',
          content: 'The irrigation system recommendations were very helpful. My water usage has decreased by 30% while maintaining crop health. Would definitely consult again for other farming challenges.',
          client_id: 'client3',
          agronomist_id: user?.id || '',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          consultation_type: 'advice',
          helpful_count: 6,
          is_verified: false,
          client: {
            first_name: 'Michael',
            last_name: 'Brown',
            avatar_url: '',
            role: 'farmer',
            is_verified: false
          },
          consultation: {
            id: 'consult3',
            subject: 'Irrigation System Optimization',
            duration: 30,
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '4',
          rating: 5,
          title: 'Comprehensive soil analysis',
          content: 'The soil analysis was incredibly thorough. Dr. Zachariah explained everything clearly and provided specific recommendations for improving soil health. My crop yields have increased significantly!',
          client_id: 'client4',
          agronomist_id: user?.id || '',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          consultation_type: 'consultation',
          helpful_count: 15,
          is_verified: true,
          client: {
            first_name: 'Emily',
            last_name: 'Davis',
            avatar_url: '',
            role: 'farmer',
            is_verified: true
          },
          consultation: {
            id: 'consult4',
            subject: 'Soil Health Analysis',
            duration: 90,
            date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '5',
          rating: 4,
          title: 'Good fertilizer recommendations',
          content: 'The fertilizer recommendations were helpful and cost-effective. My plants responded well to the suggested nutrient program. Professional and knowledgeable service.',
          client_id: 'client5',
          agronomist_id: user?.id || '',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          consultation_type: 'advice',
          helpful_count: 4,
          is_verified: false,
          client: {
            first_name: 'David',
            last_name: 'Miller',
            avatar_url: '',
            role: 'farmer',
            is_verified: false
          },
          consultation: {
            id: 'consult5',
            subject: 'Fertilizer Program Design',
            duration: 40,
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ]

      const mockStats: ReviewStats = {
        averageRating: 4.6,
        totalReviews: 24,
        ratingDistribution: {
          5: 18,
          4: 4,
          3: 1,
          2: 1,
          1: 0
        },
        consultationTypes: {
          diagnosis: 8,
          consultation: 10,
          advice: 5,
          other: 1
        },
        recentTrend: 'up'
      }

      // Sort reviews
      let sortedReviews = [...mockReviews]
      switch (sortBy) {
        case 'rating':
          sortedReviews.sort((a, b) => b.rating - a.rating)
          break
        case 'helpful':
          sortedReviews.sort((a, b) => b.helpful_count - a.helpful_count)
          break
        case 'recent':
        default:
          sortedReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
      }

      // Filter reviews
      if (filterBy !== 'all') {
        sortedReviews = sortedReviews.filter(review => review.consultation_type === filterBy)
      }

      setReviews(sortedReviews)
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getConsultationTypeColor = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-red-100 text-red-800'
      case 'consultation':
        return 'bg-blue-100 text-blue-800'
      case 'advice':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">⭐ Reviews</h3>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="helpful">Helpful</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="advice">Advice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">⭐ Reviews</h3>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="helpful">Helpful</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="advice">Advice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {stats && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(stats.averageRating))}
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.totalReviews}</div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-1">
                    {stats.recentTrend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : stats.recentTrend === 'down' ? (
                      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-gray-500 rotate-90" />
                    )}
                    <span className="text-sm text-gray-600">Recent Trend</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Rating Distribution</h5>
              {Object.entries(stats.ratingDistribution).reverse().map(([rating, count]) => {
                const percentage = (count / stats.totalReviews) * 100
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-4 text-sm">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm text-gray-600">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-600">Client reviews will appear here once you start providing consultations.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.client.avatar_url} />
                    <AvatarFallback>
                      {review.client.first_name[0]}{review.client.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {review.client.first_name} {review.client.last_name}
                          </h4>
                          {review.client.is_verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-green-100 text-green-800"
                          >
                            {review.client.role}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getConsultationTypeColor(review.consultation_type)}`}
                          >
                            {review.consultation_type}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {review.helpful_count}
                      </Button>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">{review.title}</h5>
                      <p className="text-gray-700 leading-relaxed">{review.content}</p>
                    </div>

                    {/* Consultation Details */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {review.consultation.subject}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDuration(review.consultation.duration)}
                        </div>
                        {review.is_verified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Award className="h-4 w-4" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
