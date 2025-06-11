import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // In a real implementation, you would fetch this data from a database
    // For this example, we'll return mock data

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockData = {
      posts: [
        {
          id: 1,
          title: "Best practices for avocado irrigation during dry season",
          content:
            "I'm experiencing challenges with my avocado irrigation during the current dry season. The leaves are starting to curl and I'm concerned about fruit development. What irrigation schedules and techniques are you using to maintain healthy trees during drought conditions?",
          author: "John Doe",
          avatar: "JD",
          date: "2023-05-10T14:30:00Z",
          likes: 15,
          comments: 8,
        },
        {
          id: 2,
          title: "FCM monitoring frequency - is twice weekly enough?",
          content:
            "I've been monitoring for FCM twice weekly as recommended, but I'm wondering if this is sufficient during peak moth activity periods. Has anyone increased their monitoring frequency during certain seasons and seen better results?",
          author: "Sarah Johnson",
          avatar: "SJ",
          date: "2023-05-07T09:15:00Z",
          likes: 7,
          comments: 12,
        },
        {
          id: 3,
          title: "Identifying early signs of anthracnose in avocados",
          content:
            "I'm having trouble distinguishing between early anthracnose symptoms and sunburn on my avocado fruits. Can anyone share clear images or descriptions of what to look for in the early stages of anthracnose infection?",
          author: "Michael Chen",
          avatar: "MC",
          date: "2023-05-05T16:45:00Z",
          likes: 23,
          comments: 15,
        },
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    return NextResponse.json({ error: "Failed to fetch forum posts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // In a real implementation, you would save this data to a database
    console.log("New Forum Post:", data)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Forum post created successfully",
      postId: Math.floor(Math.random() * 1000) + 4, // Mock ID for the new post
    })
  } catch (error) {
    console.error("Error creating forum post:", error)
    return NextResponse.json({ error: "Failed to create forum post" }, { status: 500 })
  }
}
