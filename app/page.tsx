import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TreesIcon as Plant, Shield, Users, Camera, Upload } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JuiGcbRyknAan87EBE7vuLqE0q9PH1.png"
            alt="Smart Agriculture Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-agribeta-green/10 to-white dark:from-agribeta-green/20 dark:to-background"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-agribeta-green">
                  AgriBeta: Smart Agricultural Management
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Comprehensive solutions for avocado disease diagnosis and FCM management in roses.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/diagnosis">
                  <Button size="lg" className="bg-agribeta-green hover:bg-agribeta-green/90">
                    <Plant className="mr-2 h-4 w-4" />
                    Diagnose Disease
                  </Button>
                </Link>
                <Link href="/fcm-management">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-agribeta-orange text-agribeta-orange hover:bg-agribeta-orange/10"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    FCM Management
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/agribeta-logo.jpeg"
                alt="AgriBeta Logo"
                width={500}
                height={300}
                className="rounded-xl object-contain bg-white/80 p-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-agribeta-green">
                Comprehensive Agricultural Solutions
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                AgriBeta provides cutting-edge tools for agricultural management, disease diagnosis, and regulatory
                compliance.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card className="border-agribeta-green/20">
              <CardHeader>
                <Plant className="h-10 w-10 text-agribeta-green mb-2" />
                <CardTitle>Disease Diagnosis</CardTitle>
                <CardDescription>
                  AI-powered diagnosis for avocado diseases with treatment recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-500" />
                    <span className="text-sm mt-1">Upload</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Camera className="h-8 w-8 text-gray-500" />
                    <span className="text-sm mt-1">Capture</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/diagnosis" className="w-full">
                  <Button className="w-full bg-agribeta-green hover:bg-agribeta-green/90">Start Diagnosis</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="border-agribeta-orange/20">
              <CardHeader>
                <Shield className="h-10 w-10 text-agribeta-orange mb-2" />
                <CardTitle>FCM Management</CardTitle>
                <CardDescription>Comprehensive tools for False Codling Moth management in roses.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Meet EU regulations (2019/2072 and 2024/2004) with our systematic approach to FCM management.</p>
              </CardContent>
              <CardFooter>
                <Link href="/fcm-management" className="w-full">
                  <Button className="w-full bg-agribeta-orange hover:bg-agribeta-orange/90">Manage FCM</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="border-agribeta-green/20">
              <CardHeader>
                <Users className="h-10 w-10 text-agribeta-green mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>Connect with other farmers and agricultural experts.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Share knowledge, ask questions, and learn from the experiences of other agricultural professionals.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/community" className="w-full">
                  <Button className="w-full bg-agribeta-green hover:bg-agribeta-green/90">Join Community</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-agribeta-orange">
                Educational Resources
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Access comprehensive guides and resources for avocado cultivation and rose management.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-8">
            <Card className="border-agribeta-green/20">
              <CardHeader>
                <CardTitle className="text-agribeta-green">Avocado Cultivation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="/placeholder.svg?key=1q5g6"
                  alt="Avocado Cultivation"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p>Comprehensive guide to growing healthy avocados, from planting to harvest.</p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/avocado-guide" className="w-full">
                  <Button
                    className="w-full border-agribeta-green text-agribeta-green hover:bg-agribeta-green/10"
                    variant="outline"
                  >
                    Read Guide
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="border-agribeta-orange/20">
              <CardHeader>
                <CardTitle className="text-agribeta-orange">FCM Compliance Manual</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="/placeholder.svg?key=pv8mt"
                  alt="FCM Management"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p>Detailed manual for implementing FCM management protocols in rose production.</p>
              </CardContent>
              <CardFooter>
                <Link href="/fcm-management/document" className="w-full">
                  <Button
                    className="w-full border-agribeta-orange text-agribeta-orange hover:bg-agribeta-orange/10"
                    variant="outline"
                  >
                    Read Manual
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
