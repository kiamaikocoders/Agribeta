"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { 
  Edit, 
  Save, 
  X, 
  Upload, 
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Facebook,
  Heart,
  TrendingUp,
  MessageCircle,
  Star,
  BarChart3,
  DollarSign,
  Users,
  Award
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ProfilePosts } from './profile-posts'
import { ProfileAnalytics } from './profile-analytics'
import { ProfileReviews } from './profile-reviews'
import { ProfileDashboard } from './profile-dashboard'

interface EnhancedProfileEditorProps {
  onUpdate?: () => void
}

export function EnhancedProfileEditor({ onUpdate }: EnhancedProfileEditorProps) {
  const { user, profile, farmerProfile, agronomistProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    industry: profile?.industry || '',
    facebook_url: profile?.facebook_url || '',
    date_of_birth: profile?.date_of_birth || '',
    farm_name: farmerProfile?.farm_name || '',
    company: agronomistProfile?.company || '',
    // Farmer specific
    farm_size: farmerProfile?.farm_size?.toString() || '',
    farm_location: farmerProfile?.farm_location || '',
    primary_crop: farmerProfile?.primary_crop || '',
    secondary_crops: farmerProfile?.secondary_crops || [],
    irrigation_type: farmerProfile?.irrigation_type || '',
    soil_type: farmerProfile?.soil_type || '',
    // Agronomist specific
    title: agronomistProfile?.title || '',
    years_experience: agronomistProfile?.years_experience?.toString() || '',
    specializations: agronomistProfile?.specializations || [],
    certifications: agronomistProfile?.certifications || [],
    hourly_rate: agronomistProfile?.hourly_rate?.toString() || '',
    consultation_fee: agronomistProfile?.consultation_fee?.toString() || '',
    timezone: agronomistProfile?.timezone || ''
  })

  // Get tabs based on user role
  const getTabs = () => {
    if (profile?.role === 'farmer') {
      return [
        { id: 'about', label: 'About' },
        { id: 'posts', label: 'Posts' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'dashboard', label: 'Dashboard' }
      ]
    } else if (profile?.role === 'agronomist') {
      return [
        { id: 'about', label: 'About' },
        { id: 'posts', label: 'Posts' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'dashboard', label: 'Dashboard' }
      ]
    }
    return [{ id: 'about', label: 'About' }]
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayInputChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [field]: array
    }))
  }

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        country: profile.country || '',
        industry: profile.industry || '',
        facebook_url: profile.facebook_url || '',
        date_of_birth: profile.date_of_birth || '',
        farm_name: farmerProfile?.farm_name || '',
        company: agronomistProfile?.company || '',
        // Farmer specific
        farm_size: farmerProfile?.farm_size?.toString() || '',
        farm_location: farmerProfile?.farm_location || '',
        primary_crop: farmerProfile?.primary_crop || '',
        secondary_crops: farmerProfile?.secondary_crops || [],
        irrigation_type: farmerProfile?.irrigation_type || '',
        soil_type: farmerProfile?.soil_type || '',
        // Agronomist specific
        title: agronomistProfile?.title || '',
        years_experience: agronomistProfile?.years_experience?.toString() || '',
        specializations: agronomistProfile?.specializations || [],
        certifications: agronomistProfile?.certifications || [],
        hourly_rate: agronomistProfile?.hourly_rate?.toString() || '',
        consultation_fee: agronomistProfile?.consultation_fee?.toString() || '',
        timezone: agronomistProfile?.timezone || ''
      })
    }
  }, [profile, farmerProfile, agronomistProfile])

  const handleImageUpload = async (file: File) => {
    if (!user) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast({
        title: 'Profile photo updated',
        description: 'Your profile photo has been updated successfully!'
      })

      onUpdate?.()
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to update profile photo. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          phone: formData.phone,
          country: formData.country,
          industry: formData.industry,
          facebook_url: formData.facebook_url,
          date_of_birth: formData.date_of_birth,
          farm_name: formData.farm_name,
          company: formData.company
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update role-specific profile
      if (profile?.role === 'farmer') {
        const { data: sessionData } = await supabase.auth.getSession()
        const accessToken = sessionData.session?.access_token
        if (!accessToken) throw new Error('No session found')
        const res = await fetch('/api/profiles/farmer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: user.id,
            farm_size: formData.farm_size ? parseFloat(formData.farm_size) : null,
            farm_location: formData.farm_location,
            primary_crop: formData.primary_crop,
            secondary_crops: formData.secondary_crops,
            irrigation_type: formData.irrigation_type,
            soil_type: formData.soil_type,
            farm_name: formData.farm_name,
          })
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || 'Failed to save farmer profile')
        }
      } else if (profile?.role === 'agronomist') {
        const { data: sessionData } = await supabase.auth.getSession()
        const accessToken = sessionData.session?.access_token
        if (!accessToken) throw new Error('No session found')
        const res = await fetch('/api/profiles/agronomist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: user.id,
            title: formData.title,
            years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
            specializations: formData.specializations,
            certifications: formData.certifications,
            hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
            consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : null,
            timezone: formData.timezone,
            company: formData.company,
          })
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || 'Failed to save agronomist profile')
        }
      }

      setIsEditing(false)
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully!'
      })

      // Refresh the page to show updated data
      if (onUpdate) {
        onUpdate()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      industry: profile?.industry || '',
      facebook_url: profile?.facebook_url || '',
      date_of_birth: profile?.date_of_birth || '',
      farm_name: farmerProfile?.farm_name || '',
      company: agronomistProfile?.company || '',
      farm_size: farmerProfile?.farm_size?.toString() || '',
      farm_location: farmerProfile?.farm_location || '',
      primary_crop: farmerProfile?.primary_crop || '',
      secondary_crops: farmerProfile?.secondary_crops || [],
      irrigation_type: farmerProfile?.irrigation_type || '',
      soil_type: farmerProfile?.soil_type || '',
      title: agronomistProfile?.title || '',
      years_experience: agronomistProfile?.years_experience?.toString() || '',
      specializations: agronomistProfile?.specializations || [],
      certifications: agronomistProfile?.certifications || [],
      hourly_rate: agronomistProfile?.hourly_rate?.toString() || '',
      consultation_fee: agronomistProfile?.consultation_fee?.toString() || '',
      timezone: agronomistProfile?.timezone || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 lg:h-32 lg:w-32">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl">
              {profile?.first_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.first_name || profile?.email || 'User'
                }
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {profile?.role === 'farmer' ? 'Growing Farm' : 'Professional Agronomist'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant={profile?.role === 'farmer' ? 'default' : 'secondary'}
                  className={profile?.role === 'farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                >
                  {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {profile?.country || 'Location not set'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
        }}
        className="hidden"
      />

      {/* Role-Based Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
          {getTabs().map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.id === 'about' && <User className="h-4 w-4" />}
              {tab.id === 'posts' && <MessageCircle className="h-4 w-4" />}
              {tab.id === 'analytics' && <BarChart3 className="h-4 w-4" />}
              {tab.id === 'reviews' && <Star className="h-4 w-4" />}
              {tab.id === 'dashboard' && <TrendingUp className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-8 mt-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              {isEditing && (
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">About</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {formData.bio || "No bio provided yet."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.phone || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.date_of_birth || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="industry" className="text-sm font-medium text-gray-700">Industry</Label>
                    {isEditing ? (
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.industry || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">Location</Label>
                    {isEditing ? (
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.country || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Facebook className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="facebook_url" className="text-sm font-medium text-gray-700">Facebook</Label>
                    {isEditing ? (
                      <Input
                        id="facebook_url"
                        type="url"
                        value={formData.facebook_url}
                        onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                        placeholder="https://facebook.com/yourprofile"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.facebook_url || "Not connected"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="mt-1 text-gray-900">{profile?.email || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Information */}
          {profile?.role === 'farmer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">🚜 Farm Information</h3>
                {isEditing && (
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="farm_name" className="text-sm font-medium text-gray-700">Farm Name</Label>
                      {isEditing ? (
                        <Input
                          id="farm_name"
                          value={formData.farm_name}
                          onChange={(e) => handleInputChange('farm_name', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.farm_name || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="farm_size" className="text-sm font-medium text-gray-700">Farm Size (hectares)</Label>
                      {isEditing ? (
                        <Input
                          id="farm_size"
                          type="number"
                          value={formData.farm_size}
                          onChange={(e) => handleInputChange('farm_size', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.farm_size || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="farm_location" className="text-sm font-medium text-gray-700">Farm Location</Label>
                      {isEditing ? (
                        <Input
                          id="farm_location"
                          value={formData.farm_location}
                          onChange={(e) => handleInputChange('farm_location', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.farm_location || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="primary_crop" className="text-sm font-medium text-gray-700">Primary Crop</Label>
                      {isEditing ? (
                        <Input
                          id="primary_crop"
                          value={formData.primary_crop}
                          onChange={(e) => handleInputChange('primary_crop', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.primary_crop || "Not specified"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profile?.role === 'agronomist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">👨‍🔬 Professional Information</h3>
                {isEditing && (
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.company || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">Professional Title</Label>
                      {isEditing ? (
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.title || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="years_experience" className="text-sm font-medium text-gray-700">Years of Experience</Label>
                      {isEditing ? (
                        <Input
                          id="years_experience"
                          type="number"
                          value={formData.years_experience}
                          onChange={(e) => handleInputChange('years_experience', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.years_experience || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="hourly_rate" className="text-sm font-medium text-gray-700">Hourly Rate ($)</Label>
                      {isEditing ? (
                        <Input
                          id="hourly_rate"
                          type="number"
                          value={formData.hourly_rate}
                          onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.hourly_rate ? `$${formData.hourly_rate}` : "Not specified"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Statistics */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">📊 Profile Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg p-4 text-center">
                <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <TrendingUp className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-sm text-gray-600">Post Impressions</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <Heart className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Connections</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <Award className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Achievements</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6 mt-8">
          <ProfilePosts userId={user?.id} />
        </TabsContent>

        {/* Analytics Tab (Farmers Only) */}
        <TabsContent value="analytics" className="space-y-6 mt-8">
          <ProfileAnalytics userId={user?.id} />
        </TabsContent>

        {/* Reviews Tab (Agronomists Only) */}
        <TabsContent value="reviews" className="space-y-6 mt-8">
          <ProfileReviews userId={user?.id} />
        </TabsContent>

        {/* Dashboard Tab (Agronomists Only) */}
        <TabsContent value="dashboard" className="space-y-6 mt-8">
          <ProfileDashboard userId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
