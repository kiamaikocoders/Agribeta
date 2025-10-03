"use client"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageBackground } from '@/components/page-background'
import { Bell, Shield, Globe, Palette, Smartphone, Mail, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '' as 'farmer' | 'agronomist' | 'admin' | '',
    phone: '',
    country: '',
    industry: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        role: profile.role,
        phone: profile.phone || '',
        country: profile.country || '',
        industry: profile.industry || ''
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          country: form.country,
          industry: form.industry,
        })
        .eq('id', user.id)
      if (error) throw error
      toast({ title: 'Saved', description: 'Your settings were updated.' })
    } catch (e) {
      console.error(e)
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-agribeta-green mb-2">Settings</h1>
            <p className="text-lg text-muted-foreground">Customize your account preferences and notifications</p>
          </div>

          <div className="space-y-6">
            {/* Profile Basics */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First name</Label>
                  <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email} disabled />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={form.role} disabled />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on mobile</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and services</p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow data sharing for research purposes</p>
                  </div>
                  <Switch id="data-sharing" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>Set your preferred language and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="east-africa">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="east-africa">East Africa Time (EAT)</SelectItem>
                        <SelectItem value="west-africa">West Africa Time (WAT)</SelectItem>
                        <SelectItem value="central-africa">Central Africa Time (CAT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Display & Appearance
                </CardTitle>
                <CardDescription>Customize how the platform looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme for better visibility</p>
                  </div>
                  <Switch id="dark-mode" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Use compact layout for more content</p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="bg-agribeta-green hover:bg-agribeta-green/90">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </PageBackground>
    </ProtectedRoute>
  )
}


