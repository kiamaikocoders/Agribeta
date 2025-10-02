"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/auth-context'
import { 
  Plus, 
  Save, 
  ArrowLeft,
  Tag,
  Clock,
  Users,
  Eye,
  Share,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CreateTemplatePage() {
  const { profile, agronomistProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [template, setTemplate] = useState({
    title: '',
    description: '',
    category: '',
    crop: '',
    difficulty: '',
    duration: '',
    steps: [''],
    tags: [],
    isPublic: true,
    isFeatured: false,
    targetAudience: 'farmers',
    prerequisites: '',
    materials: [],
    expectedOutcome: '',
    safetyNotes: '',
    followUpActions: ''
  })

  const [newTag, setNewTag] = useState('')
  const [newMaterial, setNewMaterial] = useState('')
  const [newStep, setNewStep] = useState('')

  const categories = [
    'Disease Treatment',
    'Prevention',
    'Cultural Practices',
    'Pest Management',
    'Fertilization',
    'Harvesting',
    'Soil Management',
    'Pruning',
    'Planting',
    'Irrigation'
  ]

  const crops = [
    'Avocado',
    'Rose',
    'Both'
  ]

  const difficulties = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ]

  const targetAudiences = [
    'Farmers',
    'Agronomists',
    'Students',
    'Researchers',
    'All'
  ]

  const addStep = () => {
    if (newStep.trim()) {
      setTemplate({
        ...template,
        steps: [...template.steps, newStep.trim()]
      })
      setNewStep('')
    }
  }

  const removeStep = (index: number) => {
    const newSteps = template.steps.filter((_, i) => i !== index)
    setTemplate({
      ...template,
      steps: newSteps
    })
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...template.steps]
    newSteps[index] = value
    setTemplate({
      ...template,
      steps: newSteps
    })
  }

  const addTag = () => {
    if (newTag.trim() && !template.tags.includes(newTag.trim())) {
      setTemplate({
        ...template,
        tags: [...template.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTemplate({
      ...template,
      tags: template.tags.filter(t => t !== tag)
    })
  }

  const addMaterial = () => {
    if (newMaterial.trim() && !template.materials.includes(newMaterial.trim())) {
      setTemplate({
        ...template,
        materials: [...template.materials, newMaterial.trim()]
      })
      setNewMaterial('')
    }
  }

  const removeMaterial = (material: string) => {
    setTemplate({
      ...template,
      materials: template.materials.filter(m => m !== material)
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Here you would typically make an API call to save the template
      console.log('Saving template:', template)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Template created successfully!')
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Error creating template. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/templates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-agribeta-green">Create Treatment Template</h1>
              <p className="text-muted-foreground">Build a comprehensive treatment protocol for avocado and rose farming</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step 
                    ? 'bg-agribeta-green text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-agribeta-green' : 'text-gray-600'
                }`}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Treatment Steps'}
                  {step === 3 && 'Materials & Safety'}
                  {step === 4 && 'Review & Publish'}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-agribeta-green' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the essential details about your treatment template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Template Title *</Label>
                    <Input
                      id="title"
                      value={template.title}
                      onChange={(e) => setTemplate({...template, title: e.target.value})}
                      placeholder="e.g., Avocado Anthracnose Treatment Protocol"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={template.description}
                      onChange={(e) => setTemplate({...template, description: e.target.value})}
                      placeholder="Provide a detailed description of what this template covers..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={template.category} onValueChange={(value) => setTemplate({...template, category: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="crop">Crop *</Label>
                      <Select value={template.crop} onValueChange={(value) => setTemplate({...template, crop: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          {crops.map(crop => (
                            <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level *</Label>
                      <Select value={template.difficulty} onValueChange={(value) => setTemplate({...template, difficulty: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map(difficulty => (
                            <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Estimated Duration</Label>
                      <Input
                        id="duration"
                        value={template.duration}
                        onChange={(e) => setTemplate({...template, duration: e.target.value})}
                        placeholder="e.g., 2-3 weeks, 1 day, Ongoing"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select value={template.targetAudience} onValueChange={(value) => setTemplate({...template, targetAudience: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map(audience => (
                          <SelectItem key={audience} value={audience.toLowerCase()}>{audience}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Steps</CardTitle>
                  <CardDescription>Define the step-by-step process for your treatment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Treatment Steps *</Label>
                    <div className="space-y-4 mt-2">
                      {template.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-agribeta-green/10 rounded-full flex items-center justify-center text-sm font-medium text-agribeta-green">
                            {index + 1}
                          </div>
                          <Textarea
                            value={step}
                            onChange={(e) => updateStep(index, e.target.value)}
                            placeholder={`Step ${index + 1}: Describe what needs to be done...`}
                            className="flex-1"
                            rows={2}
                          />
                          {template.steps.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeStep(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Add a new step..."
                        className="flex-1"
                      />
                      <Button onClick={addStep} disabled={!newStep.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expectedOutcome">Expected Outcome</Label>
                    <Textarea
                      id="expectedOutcome"
                      value={template.expectedOutcome}
                      onChange={(e) => setTemplate({...template, expectedOutcome: e.target.value})}
                      placeholder="Describe what results farmers can expect from following this treatment..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="followUpActions">Follow-up Actions</Label>
                    <Textarea
                      id="followUpActions"
                      value={template.followUpActions}
                      onChange={(e) => setTemplate({...template, followUpActions: e.target.value})}
                      placeholder="What should farmers do after completing this treatment? Any monitoring or follow-up required?"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Materials & Safety</CardTitle>
                  <CardDescription>List required materials and important safety considerations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Required Materials</Label>
                    <div className="space-y-2 mt-2">
                      {template.materials.map((material, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 p-2 border rounded bg-gray-50">
                            {material}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeMaterial(material)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        value={newMaterial}
                        onChange={(e) => setNewMaterial(e.target.value)}
                        placeholder="Add a material (e.g., Copper fungicide, Pruning shears)"
                        className="flex-1"
                      />
                      <Button onClick={addMaterial} disabled={!newMaterial.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Material
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="safetyNotes">Safety Notes</Label>
                    <Textarea
                      id="safetyNotes"
                      value={template.safetyNotes}
                      onChange={(e) => setTemplate({...template, safetyNotes: e.target.value})}
                      placeholder="Important safety considerations, protective equipment needed, environmental precautions..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <Textarea
                      id="prerequisites"
                      value={template.prerequisites}
                      onChange={(e) => setTemplate({...template, prerequisites: e.target.value})}
                      placeholder="Any prior knowledge, skills, or conditions required before starting this treatment..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Publish</CardTitle>
                  <CardDescription>Review your template and set publishing options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Template Title</h4>
                      <p className="text-muted-foreground">{template.title}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Description</h4>
                      <p className="text-muted-foreground">{template.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Category</h4>
                        <p className="text-muted-foreground">{template.category}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Crop</h4>
                        <p className="text-muted-foreground">{template.crop}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Treatment Steps ({template.steps.length})</h4>
                      <div className="space-y-2">
                        {template.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="w-6 h-6 bg-agribeta-green/10 rounded-full flex items-center justify-center text-xs font-medium text-agribeta-green">
                              {index + 1}
                            </span>
                            <p className="text-sm text-muted-foreground">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isPublic">Make Template Public</Label>
                        <p className="text-sm text-muted-foreground">Allow other users to view and use this template</p>
                      </div>
                      <Switch
                        id="isPublic"
                        checked={template.isPublic}
                        onCheckedChange={(checked) => setTemplate({...template, isPublic: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isFeatured">Feature Template</Label>
                        <p className="text-sm text-muted-foreground">Highlight this template in the knowledge base</p>
                      </div>
                      <Switch
                        id="isFeatured"
                        checked={template.isFeatured}
                        onCheckedChange={(checked) => setTemplate({...template, isFeatured: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
                <CardDescription>Add tags to help users find your template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button onClick={addTag} disabled={!newTag.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Template Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Steps</span>
                  <span className="font-medium">{template.steps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Materials</span>
                  <span className="font-medium">{template.materials.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tags</span>
                  <span className="font-medium">{template.tags.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={template.isPublic ? 'default' : 'secondary'}>
                    {template.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from File
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share Preview
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </span>
          </div>
          
          {currentStep < 4 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
