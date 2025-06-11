import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Video, ImageIcon, Download, ExternalLink } from "lucide-react"

export function ResourceLibrary() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="images">Images & Infographics</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-lg">Avocado Cultivation Guide</CardTitle>
                </div>
                <CardDescription>Comprehensive guide to growing healthy avocados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  This 45-page guide covers all aspects of avocado cultivation, from soil preparation to harvest
                  techniques.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>PDF • 4.2 MB • Uploaded 3 months ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-lg">FCM Management Protocol</CardTitle>
                </div>
                <CardDescription>Official protocol for FCM management in roses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Detailed protocol for implementing FCM management practices in rose production to meet EU regulations.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>PDF • 2.8 MB • Uploaded 1 month ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-lg">Disease Identification Chart</CardTitle>
                </div>
                <CardDescription>Visual guide to common avocado diseases</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Reference chart for identifying common avocado diseases with images and treatment recommendations.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>PDF • 5.1 MB • Uploaded 2 months ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Video className="h-6 w-6 text-red-600 mr-2" />
                  <CardTitle className="text-lg">FCM Trap Installation</CardTitle>
                </div>
                <CardDescription>Step-by-step guide to installing pheromone traps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?key=0l2oy"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>12:45 • Uploaded 2 weeks ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Video className="h-6 w-6 text-red-600 mr-2" />
                  <CardTitle className="text-lg">Avocado Pruning Techniques</CardTitle>
                </div>
                <CardDescription>Proper pruning methods for healthy avocado trees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?key=5inff"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>18:32 • Uploaded 1 month ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Video className="h-6 w-6 text-red-600 mr-2" />
                  <CardTitle className="text-lg">Disease Diagnosis Demo</CardTitle>
                </div>
                <CardDescription>Using AgriBeta for accurate disease diagnosis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <img
                    src="/plant-disease-app-thumbnail.png"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>8:15 • Uploaded 3 weeks ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="images" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <ImageIcon className="h-6 w-6 text-green-600 mr-2" />
                  <CardTitle className="text-lg">FCM Lifecycle Infographic</CardTitle>
                </div>
                <CardDescription>Visual guide to the FCM lifecycle</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/false-codling-moth-lifecycle.png"
                  alt="FCM Lifecycle"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex items-center text-sm text-gray-500">
                  <span>PNG • 1.8 MB • Uploaded 2 months ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <ImageIcon className="h-6 w-6 text-green-600 mr-2" />
                  <CardTitle className="text-lg">Avocado Disease Chart</CardTitle>
                </div>
                <CardDescription>Visual identification of common avocado diseases</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/avocado-diseases-chart.png"
                  alt="Avocado Disease Chart"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex items-center text-sm text-gray-500">
                  <span>JPG • 2.4 MB • Uploaded 3 months ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <ImageIcon className="h-6 w-6 text-green-600 mr-2" />
                  <CardTitle className="text-lg">Greenhouse Setup Guide</CardTitle>
                </div>
                <CardDescription>Diagram of optimal greenhouse setup for roses</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/greenhouse-roses-diagram.png"
                  alt="Greenhouse Setup"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex items-center text-sm text-gray-500">
                  <span>PNG • 3.2 MB • Uploaded 1 month ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
