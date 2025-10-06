// Weather data service to fetch and process weather information

// Types for weather data
export interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    localtime: string
  }
  current: {
    temp_c: number
    humidity: number
    precip_mm: number
    wind_kph: number
    condition: {
      text: string
      icon: string
    }
    uv: number
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        avgtemp_c: number
        totalrecip_mm: number
        avghumidity: number
        condition: {
          text: string
          icon: string
        }
        uv: number
      }
      hour: Array<{
        time: string
        temp_c: number
        humidity: number
        precip_mm: number
        condition: {
          text: string
          icon: string
        }
      }>
    }>
  }
}

// Disease risk factors based on weather conditions
export interface DiseaseRiskFactor {
  disease: string
  conditions: {
    temperature: {
      min: number
      max: number
      optimal: number
    }
    humidity: {
      min: number
      max: number
      optimal: number
    }
    rainfall: {
      min: number
      max: number
      optimal: number
    }
  }
  riskLevel: (weather: WeatherData) => number // 0-100
  description: string
}

// Disease risk factors for common avocado diseases
export const avocadoDiseaseRiskFactors: DiseaseRiskFactor[] = [
  {
    disease: "Anthracnose",
    conditions: {
      temperature: {
        min: 20,
        max: 30,
        optimal: 25,
      },
      humidity: {
        min: 60,
        max: 95,
        optimal: 80,
      },
      rainfall: {
        min: 0.5,
        max: 10,
        optimal: 2,
      },
    },
    riskLevel: (weather: WeatherData) => {
      const temp = weather.current.temp_c
      const humidity = weather.current.humidity
      const rainfall = weather.current.precip_mm

      // Calculate risk based on how close current conditions are to optimal conditions
      const tempFactor = 100 - Math.min(100, Math.abs(temp - 25) * 10)
      const humidityFactor = 100 - Math.min(100, Math.abs(humidity - 80) * 2)
      const rainfallFactor = rainfall > 0.5 ? 100 : Math.min(100, rainfall * 200)

      return Math.round((tempFactor + humidityFactor + rainfallFactor) / 3)
    },
    description:
      "Anthracnose thrives in warm, humid conditions with moderate rainfall. The disease is particularly severe when temperatures range from 20-30°C with high humidity above 60%.",
  },
  {
    disease: "Phytophthora Root Rot",
    conditions: {
      temperature: {
        min: 15,
        max: 27,
        optimal: 21,
      },
      humidity: {
        min: 70,
        max: 100,
        optimal: 85,
      },
      rainfall: {
        min: 1,
        max: 15,
        optimal: 5,
      },
    },
    riskLevel: (weather: WeatherData) => {
      const temp = weather.current.temp_c
      const humidity = weather.current.humidity
      const rainfall = weather.current.precip_mm

      // Calculate risk based on how close current conditions are to optimal conditions
      const tempFactor = 100 - Math.min(100, Math.abs(temp - 21) * 10)
      const humidityFactor = humidity > 70 ? 100 - Math.min(100, Math.abs(humidity - 85)) : 0
      const rainfallFactor = rainfall > 1 ? 100 : Math.min(100, rainfall * 100)

      return Math.round((tempFactor + humidityFactor + rainfallFactor) / 3)
    },
    description:
      "Phytophthora Root Rot is favored by wet, poorly drained soils and moderate temperatures. The disease is most active when soil is waterlogged and temperatures are between 15-27°C.",
  },
  {
    disease: "Cercospora Spot",
    conditions: {
      temperature: {
        min: 22,
        max: 32,
        optimal: 28,
      },
      humidity: {
        min: 65,
        max: 95,
        optimal: 85,
      },
      rainfall: {
        min: 0.5,
        max: 8,
        optimal: 3,
      },
    },
    riskLevel: (weather: WeatherData) => {
      const temp = weather.current.temp_c
      const humidity = weather.current.humidity
      const rainfall = weather.current.precip_mm

      // Calculate risk based on how close current conditions are to optimal conditions
      const tempFactor = 100 - Math.min(100, Math.abs(temp - 28) * 10)
      const humidityFactor = humidity > 65 ? 100 - Math.min(100, Math.abs(humidity - 85)) : 0
      const rainfallFactor = rainfall > 0.5 ? 100 - Math.min(100, Math.abs(rainfall - 3) * 20) : 0

      return Math.round((tempFactor + humidityFactor + rainfallFactor) / 3)
    },
    description:
      "Cercospora Spot develops rapidly in warm, humid conditions. The disease is most severe when temperatures are between 22-32°C with high humidity and regular rainfall.",
  },
  {
    disease: "Sunblotch",
    conditions: {
      temperature: {
        min: 25,
        max: 35,
        optimal: 30,
      },
      humidity: {
        min: 40,
        max: 70,
        optimal: 55,
      },
      rainfall: {
        min: 0,
        max: 3,
        optimal: 0.5,
      },
    },
    riskLevel: (weather: WeatherData) => {
      const temp = weather.current.temp_c
      const humidity = weather.current.humidity
      const uv = weather.current.uv

      // Sunblotch is more related to UV exposure than rainfall
      const tempFactor = temp > 25 ? 100 - Math.min(100, Math.abs(temp - 30) * 10) : 0
      const humidityFactor = 100 - Math.min(100, Math.abs(humidity - 55) * 2)
      const uvFactor = Math.min(100, uv * 16.6) // UV scale is typically 0-12

      return Math.round((tempFactor + humidityFactor + uvFactor) / 3)
    },
    description:
      "Sunblotch is exacerbated by hot, dry conditions with high UV exposure. The disease symptoms are most visible when temperatures exceed 25°C with moderate to low humidity.",
  },
]

// Function to fetch weather data from the WeatherAPI.com
export async function fetchWeatherData(location = "Nairobi, Kenya"): Promise<WeatherData> {
  try {
    const apiKey = "6e6c4ea07fd646cf9b4232640250805"
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
        location,
      )}&days=7&aqi=no&alerts=no`,
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch weather data:", error)
    throw error
  }
}

// Function to calculate disease risk based on current weather
export function calculateDiseaseRisk(weather: WeatherData): Array<{ disease: string; risk: number }> {
  return avocadoDiseaseRiskFactors.map((factor) => ({
    disease: factor.disease,
    risk: factor.riskLevel(weather),
  }))
}

// Function to get weather-based recommendations
export function getWeatherRecommendations(weather: WeatherData): string[] {
  const recommendations: string[] = []
  const { temp_c, humidity, precip_mm } = weather.current

  // Temperature-based recommendations
  if (temp_c > 30) {
    recommendations.push("High temperatures pinpointed. Consider additional irrigation to prevent heat stress.")
  } else if (temp_c < 15) {
    recommendations.push("Low temperatures pinpointed. Monitor plants for cold damage and consider protective measures.")
  }

  // Humidity-based recommendations
  if (humidity > 80) {
    recommendations.push(
      "High humidity pinpointed. Increase air circulation around plants and consider preventative fungicide application.",
    )
  } else if (humidity < 40) {
    recommendations.push("Low humidity pinpointed. Consider misting plants to increase local humidity.")
  }

  // Rainfall-based recommendations
  if (precip_mm > 5) {
    recommendations.push(
      "Heavy rainfall pinpointed. Ensure proper drainage and monitor for signs of water-related diseases.",
    )
  } else if (precip_mm < 0.1 && weather.forecast.forecastday.every((day) => day.day.totalrecip_mm < 0.5)) {
    recommendations.push("Dry conditions pinpointed. Increase irrigation to maintain soil moisture.")
  }

  // Disease-specific recommendations based on risk
  const risks = calculateDiseaseRisk(weather)
  const highRiskDiseases = risks.filter((r) => r.risk > 70)

  if (highRiskDiseases.length > 0) {
    highRiskDiseases.forEach((disease) => {
      const factor = avocadoDiseaseRiskFactors.find((f) => f.disease === disease.disease)
      if (factor) {
        recommendations.push(
          `High risk of ${disease.disease} pinpointed (${disease.risk}%). Monitor plants closely and consider preventative treatments.`,
        )
      }
    })
  }

  return recommendations
}
