"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { FollowConnectButton } from '@/components/follows/follow-connect-button'
import { ProfileAnalytics } from './profile-analytics'
import { 
  Edit, 
  Save, 
  X, 
  Upload, 
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface ProfileEditorProps {
  onUpdate: () => void
}

export function ProfileEditor({ onUpdate }: ProfileEditorProps) {
  const { user, profile, farmerProfile, agronomistProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    industry: profile?.industry || '',
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

      onUpdate()
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
      onUpdate()
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully!'
      })
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
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="dashboard" asChild>
          <a href={profile?.role === 'agronomist' ? '/dashboard/agronomist' : profile?.role === 'farmer' ? '/dashboard/farmer' : '/dashboard'}>
            Dashboard
          </a>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card>
          <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Edit your profile information' : 'Manage your profile details'}
            </CardDescription>
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
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile?.first_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
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
          <div>
            <h3 className="font-semibold">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name || profile?.email || 'User'
              }
            </h3>
            <Badge variant="secondary">
              {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}
            </Badge>
            {isEditing && (
              <p className="text-sm text-muted-foreground mt-1">
                Click the camera icon to change your profile photo
              </p>
            )}
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

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        {/* Role-specific fields */}
        {profile?.role === 'farmer' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Farm Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farm_name">Farm Name</Label>
                <Input
                  id="farm_name"
                  value={formData.farm_name}
                  onChange={(e) => handleInputChange('farm_name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="farm_size">Farm Size (hectares)</Label>
                <Input
                  id="farm_size"
                  type="number"
                  value={formData.farm_size}
                  onChange={(e) => handleInputChange('farm_size', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="farm_location">Farm Location</Label>
                <Input
                  id="farm_location"
                  value={formData.farm_location}
                  onChange={(e) => handleInputChange('farm_location', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="primary_crop">Primary Crop</Label>
                <Input
                  id="primary_crop"
                  value={formData.primary_crop}
                  onChange={(e) => handleInputChange('primary_crop', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="secondary_crops">Secondary Crops (comma-separated)</Label>
                <Input
                  id="secondary_crops"
                  value={formData.secondary_crops.join(', ')}
                  onChange={(e) => handleArrayInputChange('secondary_crops', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="irrigation_type">Irrigation Type</Label>
                <Input
                  id="irrigation_type"
                  value={formData.irrigation_type}
                  onChange={(e) => handleInputChange('irrigation_type', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input
                  id="soil_type"
                  value={formData.soil_type}
                  onChange={(e) => handleInputChange('soil_type', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {profile?.role === 'agronomist' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Professional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => handleInputChange('years_experience', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  value={formData.consultation_fee}
                  onChange={(e) => handleInputChange('consultation_fee', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                <Input
                  id="specializations"
                  value={formData.specializations.join(', ')}
                  onChange={(e) => handleArrayInputChange('specializations', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                <Input
                  id="certifications"
                  value={formData.certifications.join(', ')}
                  onChange={(e) => handleArrayInputChange('certifications', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
      </TabsContent>
      
      <TabsContent value="analytics">
        <ProfileAnalytics />
      </TabsContent>
    </Tabs>
  )
}
