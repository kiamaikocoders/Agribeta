import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type") || "all"

    // In a real implementation, you would fetch this data from a database
    // For this example, we'll return mock data based on the type

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let resources = []

    switch (type) {
      case "documents":
        resources = [
          {
            id: 1,
            title: "Avocado Cultivation Guide",
            description: "Comprehensive guide to growing healthy avocados",
            content:
              "This 45-page guide covers all aspects of avocado cultivation, from soil preparation to harvest techniques.",
            fileType: "PDF",
            fileSize: "4.2 MB",
            uploadDate: "2023-02-15T10:30:00Z",
            downloadUrl: "/api/download/resource/1",
          },
          {
            id: 2,
            title: "FCM Management Protocol",
            description: "Official protocol for FCM management in roses",
            content:
              "Detailed protocol for implementing FCM management practices in rose production to meet EU regulations.",
            fileType: "PDF",
            fileSize: "2.8 MB",
            uploadDate: "2023-04-10T14:45:00Z",
            downloadUrl: "/api/download/resource/2",
          },
          {
            id: 3,
            title: "Disease Identification Chart",
            description: "Visual guide to common avocado diseases",
            content:
              "Reference chart for identifying common avocado diseases with images and treatment recommendations.",
            fileType: "PDF",
            fileSize: "5.1 MB",
            uploadDate: "2023-03-22T09:15:00Z",
            downloadUrl: "/api/download/resource/3",
          },
        ]
        break
      case "videos":
        resources = [
          {
            id: 4,
            title: "FCM Trap Installation",
            description: "Step-by-step guide to installing pheromone traps",
            duration: "12:45",
            uploadDate: "2023-04-28T15:20:00Z",
            thumbnailUrl: "/placeholder.svg?key=khlrc",
            videoUrl: "/api/stream/video/4",
          },
          {
            id: 5,
            title: "Avocado Pruning Techniques",
            description: "Proper pruning methods for healthy avocado trees",
            duration: "18:32",
            uploadDate: "2023-03-15T11:10:00Z",
            thumbnailUrl: "/placeholder.svg?key=8ie2u",
            videoUrl: "/api/stream/video/5",
          },
          {
            id: 6,
            title: "Disease Diagnosis Demo",
            description: "Using AgriBeta for accurate disease diagnosis",
            duration: "8:15",
            uploadDate: "2023-04-22T16:45:00Z",
            thumbnailUrl: "/plant-disease-app-thumbnail.png",
            videoUrl: "/api/stream/video/6",
          },
        ]
        break
      case "images":
        resources = [
          {
            id: 7,
            title: "FCM Lifecycle Infographic",
            description: "Visual guide to the FCM lifecycle",
            fileType: "PNG",
            fileSize: "1.8 MB",
            uploadDate: "2023-03-10T09:30:00Z",
            imageUrl: "/false-codling-moth-lifecycle.png",
            downloadUrl: "/api/download/resource/7",
          },
          {
            id: 8,
            title: "Avocado Disease Chart",
            description: "Visual identification of common avocado diseases",
            fileType: "JPG",
            fileSize: "2.4 MB",
            uploadDate: "2023-02-05T14:20:00Z",
            imageUrl: "/avocado-diseases-chart.png",
            downloadUrl: "/api/download/resource/8",
          },
          {
            id: 9,
            title: "Greenhouse Setup Guide",
            description: "Diagram of optimal greenhouse setup for roses",
            fileType: "PNG",
            fileSize: "3.2 MB",
            uploadDate: "2023-04-15T10:45:00Z",
            imageUrl: "/greenhouse-roses-diagram.png",
            downloadUrl: "/api/download/resource/9",
          },
        ]
        break
      case "all":
      default:
        // Combine all resource types
        resources = [
          {
            id: 1,
            title: "Avocado Cultivation Guide",
            description: "Comprehensive guide to growing healthy avocados",
            content:
              "This 45-page guide covers all aspects of avocado cultivation, from soil preparation to harvest techniques.",
            fileType: "PDF",
            fileSize: "4.2 MB",
            uploadDate: "2023-02-15T10:30:00Z",
            downloadUrl: "/api/download/resource/1",
          },
          {
            id: 4,
            title: "FCM Trap Installation",
            description: "Step-by-step guide to installing pheromone traps",
            duration: "12:45",
            uploadDate: "2023-04-28T15:20:00Z",
            thumbnailUrl: "/placeholder.svg?key=d0xku",
            videoUrl: "/api/stream/video/4",
          },
          {
            id: 7,
            title: "FCM Lifecycle Infographic",
            description: "Visual guide to the FCM lifecycle",
            fileType: "PNG",
            fileSize: "1.8 MB",
            uploadDate: "2023-03-10T09:30:00Z",
            imageUrl: "/false-codling-moth-lifecycle.png",
            downloadUrl: "/api/download/resource/7",
          },
        ]
    }

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}
