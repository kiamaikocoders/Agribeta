import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // In a real implementation, you would fetch this data from a database
    // For this example, we'll return mock data

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockData = {
      complianceScore: 78,
      lastUpdated: "2023-05-10",
      categories: [
        {
          name: "Greenhouse Structure",
          score: 100,
          status: "compliant",
          items: [
            { name: "Polythene covers intact", status: "compliant" },
            { name: "T7-20 mesh netting installed", status: "compliant" },
            { name: "Double-door systems functional", status: "compliant" },
          ],
        },
        {
          name: "Monitoring Protocol",
          score: 60,
          status: "partial",
          items: [
            { name: "Pheromone traps installed", status: "compliant" },
            { name: "Bi-weekly monitoring", status: "non-compliant" },
            { name: "Scouting records maintained", status: "compliant" },
          ],
        },
        {
          name: "Documentation",
          score: 30,
          status: "non-compliant",
          items: [
            { name: "Monitoring records", status: "non-compliant" },
            { name: "Treatment logs", status: "non-compliant" },
            { name: "Facility registration", status: "compliant" },
          ],
        },
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching FCM compliance data:", error)
    return NextResponse.json({ error: "Failed to fetch compliance data" }, { status: 500 })
  }
}
