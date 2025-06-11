import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type") || "overview"
    const period = searchParams.get("period") || "last30"

    // In a real implementation, you would fetch this data from a database
    // For this example, we'll return mock data based on the type and period

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let mockData = {}

    switch (type) {
      case "overview":
        mockData = {
          fcmComplianceScore: 78,
          diagnosesCount: 24,
          fcmDetections: 2,
          monitoringSessions: 18,
          recentActivity: [
            {
              type: "diagnosis",
              title: "Avocado Disease Diagnosis",
              description: "Anthracnose detected with 92% confidence",
              timestamp: "2023-05-12T10:24:00Z",
            },
            {
              type: "fcm",
              title: "FCM Monitoring Completed",
              description: "Greenhouse A - No FCM detected",
              timestamp: "2023-05-11T16:15:00Z",
            },
            {
              type: "alert",
              title: "Compliance Alert",
              description: "Documentation incomplete for Greenhouse B",
              timestamp: "2023-05-10T09:30:00Z",
            },
            {
              type: "action",
              title: "Corrective Action Completed",
              description: "Greenhouse netting repairs verified",
              timestamp: "2023-05-09T14:45:00Z",
            },
          ],
          environmentalConditions: {
            temperature: 24.5,
            humidity: 68,
            lightIntensity: 12500,
            co2Level: 450,
          },
        }
        break
      case "fcm":
        mockData = {
          trapCatches: {
            total: 12,
            previousPeriod: 8,
            weeklyData: [2, 1, 0, 3, 4, 1, 1],
          },
          monitoringCompliance: {
            percentage: 86,
            previousPeriod: 74,
            scheduled: 28,
            completed: 24,
          },
          greenhouseRisk: [
            { name: "Greenhouse A", riskLevel: "low", riskScore: 15 },
            { name: "Greenhouse B", riskLevel: "medium", riskScore: 45 },
            { name: "Greenhouse C", riskLevel: "high", riskScore: 75 },
            { name: "Greenhouse D", riskLevel: "low", riskScore: 20 },
          ],
          monthlyDetections: [2, 3, 1, 4, 6, 10, 8, 5, 3, 2, 2, 1],
        }
        break
      case "diagnosis":
        mockData = {
          totalDiagnoses: 24,
          previousPeriod: 16,
          weeklyData: [2, 3, 2, 4, 5, 3, 5],
          accuracy: {
            average: 87,
            previousPeriod: 84,
            highest: 98,
            lowest: 72,
          },
          inputMethod: {
            upload: 18,
            camera: 6,
          },
          diseaseDistribution: [
            { disease: "Anthracnose", percentage: 42, cases: 10 },
            { disease: "Root Rot", percentage: 25, cases: 6 },
            { disease: "Cercospora Spot", percentage: 17, cases: 4 },
            { disease: "Scab", percentage: 8, cases: 2 },
            { disease: "Other", percentage: 8, cases: 2 },
          ],
          insights: [
            "Anthracnose remains the most common disease, consistent with seasonal patterns",
            "Root rot cases have increased by 15% compared to the previous period",
            "Early detection has improved treatment success rates by 22%",
            "Recommended preventative measures have been updated based on recent diagnoses",
          ],
        }
        break
      default:
        mockData = { error: "Invalid analytics type" }
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
