import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TreesIcon as Plant, Shield, Users, Camera, Upload, Leaf, Handshake, BarChart, TrendingUp, Target, ShieldCheck, Gem, Lightbulb, Zap, Waypoints, Sparkles, BookOpen, ShoppingCart, LineChart, Diamond } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/smart-agriculture-bg.png"
            alt="Smart Agriculture Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10 text-white flex flex-col items-center justify-center text-center h-full">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-4 uppercase">
            AGRIBETA
                </h1>
          <h2 className="text-4xl sm:text-6xl xl:text-7xl/none font-extrabold text-agribeta-orange uppercase mb-6">
            WE POWER. YOU GROW.
          </h2>
          <p className="max-w-[800px] text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed">
            Smart Pest & Disease Management for African Horticulture
                </p>
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Link href="/solutions">
              <Button size="lg" className="bg-agribeta-orange hover:bg-agribeta-orange/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
                Explore Solutions
                  </Button>
                </Link>
            <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                className="border-white text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
                  >
                Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
      </section>

      {/* AgriBeta Product Suite Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-8 text-center">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-agribeta-green">
            AGRIBETA <span className="text-agribeta-orange">PRODUCT SUITE</span>
          </h2>
          {/* Infinite Scroll Container */}
          <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-xl py-5 bg-gray-200 dark:bg-gray-700">
            <div className="flex gap-5 animate-infinite-scroll w-max px-5">
              {/* Duplicate the cards twice to create the infinite loop effect */}
              {[1, 2].map((setIndex) => (
                <>
                  {/* AgriBeta Network Card */}
                  <Link href="/community" key={`network-${setIndex}`} className="flex-shrink-0 w-[250px] md:w-[200px] h-[200px] md:h-[160px] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-5px] bg-agribeta-green text-white flex flex-col items-center justify-center text-center p-6 cursor-pointer">
                    <Users className="h-8 w-8 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Agribeta Network</h3>
                    <p className="text-center text-sm">Join a community of avocado farmers</p>
                  </Link>

                  {/* AgriBeta Learn Card */}
                  <Link href="/learn" key={`learn-${setIndex}`} className="flex-shrink-0 w-[250px] md:w-[200px] h-[200px] md:h-[160px] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-5px] bg-white text-agribeta-green border border-agribeta-green/20 flex flex-col items-center justify-center text-center p-6 cursor-pointer">
                    <BookOpen className="h-8 w-8 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Agribeta Learn</h3>
                    <p className="text-center text-gray-700 text-sm">Best practices on avocado farming</p>
                  </Link>

                  {/* AgriBeta Agronomist Card */}
                  <Link href="/agronomist" key={`agronomist-${setIndex}`} className="flex-shrink-0 w-[250px] md:w-[200px] h-[200px] md:h-[160px] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-5px] bg-agribeta-green text-white flex flex-col items-center justify-center text-center p-6 cursor-pointer">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-white">
              <Image
                        src="/placeholder-agronomist.jpg" // Placeholder for agronomist image
                        alt="Virtual Agronomist"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Agribeta Agronomist</h3>
                    <p className="text-center text-sm">Consult a virtual agronomist</p>
                  </Link>

                  {/* AgriBeta Shop Card */}
                  <Link href="/shop" key={`shop-${setIndex}`} className="flex-shrink-0 w-[250px] md:w-[200px] h-[200px] md:h-[160px] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-5px] bg-white text-agribeta-green border border-agribeta-green/20 flex flex-col items-center justify-center text-center p-6 cursor-pointer">
                    <ShoppingCart className="h-8 w-8 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Agribeta Shop</h3>
                    <p className="text-center text-gray-700 text-sm">Browse farming equipment</p>
                  </Link>

                  {/* AgriBeta Enterprise Card */}
                  <Link href="/enterprise" key={`enterprise-${setIndex}`} className="flex-shrink-0 w-[250px] md:w-[200px] h-[200px] md:h-[160px] rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-5px] bg-white text-agribeta-green border border-agribeta-green/20 flex flex-col items-center justify-center text-center p-6 cursor-pointer">
                    <LineChart className="h-8 w-8 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Agribeta Enterprise</h3>
                    <p className="text-center text-gray-700 text-sm">Solutions for rose flower farmers</p>
                  </Link>
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY WE EXIST Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-agribeta-orange">
              WHY WE EXIST
              </h2>
            <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              We're on a mission to transform African horticulture through smart, systems-based
              precision agriculture—empowering every farmer to farm smarter, trade better,
              and grow stronger.
            </p>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-3 p-4">
                <Leaf className="h-12 w-12 text-agribeta-orange" />
                <h3 className="text-xl font-bold text-agribeta-green">Empower Farmers</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Providing tools and knowledge to enhance agricultural practices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-4">
                <Handshake className="h-12 w-12 text-agribeta-orange" />
                <h3 className="text-xl font-bold text-agribeta-green">Enable Trade</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Facilitating better market access and fair trade for farmers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-4">
                <BarChart className="h-12 w-12 text-agribeta-orange" />
                <h3 className="text-xl font-bold text-agribeta-green">Build Resilience</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Strengthening agricultural systems against challenges.
              </p>
              </div>
            </div>
          </div>
                  </div>
      </section>

      {/* BUILT FOR FARMERS. POWERED BY AI. Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-agribeta-green dark:bg-agribeta-green text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              BUILT FOR FARMERS. POWERED BY AI.
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-3 p-4">
                <TrendingUp className="h-12 w-12 text-agribeta-orange" />
                <h3 className="text-xl font-bold text-white">Predict</h3>
                <p className="text-gray-200 text-center">
                  Early warning systems for pests
                </p>
                  </div>
              <div className="flex flex-col items-center space-y-3 p-4">
                <Target className="h-12 w-12 text-agribeta-orange" />
                <h3 className="text-xl font-bold text-white">Pinpoint</h3>
                <p className="text-gray-200 text-center">
                  AI-based detection using imaging
                </p>
                </div>
              <div className="flex flex-col items-center space-y-3 p-4">
                <ShieldCheck className="h-12 w-12 text-agribeta-orange" />
                <h3 className="text-xl font-bold text-white">Protect</h3>
                <p className="text-gray-200 text-center">
                  Timely. Actionable Interventions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AgriBeta: Smart-Pest & Disease Management Platform Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-agribeta-green mb-6">
              AGRIBETA
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">
              Smart-Pest & Disease Management Platform
            </h3>
            <div className="flex justify-center lg:justify-start space-x-4 mb-8">
              <button className="bg-agribeta-green text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md">PREDICT</button>
              <button className="bg-agribeta-orange text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md">DETECT</button>
              <button className="bg-agribeta-green text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md">PROTECT</button>
            </div>
            <ul className="text-lg text-gray-700 space-y-3 list-disc list-inside lg:pl-0">
              <li>Easy-to-use interface for farmers</li>
              <li>Real-time alerts & smart advice</li>
              <li>Works offline in remote areas</li>
              <li>Supports local languages</li>
              <li>Tracks pest & disease trends</li>
              <li>Empowers better farm decisions</li>
            </ul>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[600px] bg-gray-200 rounded-[2.5rem] shadow-xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-8 bg-black rounded-b-xl z-10"></div> {/* Phone notch */}
              <Image
                src="/agribeta-predict-screen.jpg"
                alt="AgriBeta Phone Screen"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATED PEST & DISEASE MANAGEMENT Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-agribeta-green mb-4">
            INTEGRATED PEST & DISEASE MANAGEMENT
          </h2>
          <p className="max-w-3xl text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mb-8">
            Holistic, comprehensive, multi-faceted, multi-layered, preventive & curative measures
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {/* Prediction Card */}
            <Card className="flex flex-col items-center p-6 text-center shadow-lg rounded-lg bg-white dark:bg-gray-900">
              <div className="bg-agribeta-orange rounded-full h-12 w-12 flex items-center justify-center text-white text-xl font-bold mb-4">1</div>
              <CardTitle className="text-agribeta-orange text-2xl font-bold mb-4">PREDICTION</CardTitle>
              <ul className="text-gray-700 text-lg space-y-2 list-disc list-inside">
                <li>Environmental data</li>
                <li>Observational data</li>
                <li>Pest & disease trends</li>
                <li>Early warning systems</li>
              </ul>
              <LineChart
                className="mt-6 h-24 w-24 text-agribeta-green"
              />
            </Card>

            {/* Detection Card */}
            <Card className="flex flex-col items-center p-6 text-center shadow-lg rounded-lg bg-white dark:bg-gray-900">
              <div className="bg-agribeta-orange rounded-full h-12 w-12 flex items-center justify-center text-white text-xl font-bold mb-4">2</div>
              <CardTitle className="text-agribeta-orange text-2xl font-bold mb-4">DETECTION</CardTitle>
              <ul className="text-gray-700 text-lg space-y-2 list-disc list-inside">
                <li>Image recognition through machine learning</li>
              </ul>
              <Camera
                className="mt-6 h-24 w-24 text-agribeta-green"
              />
            </Card>

            {/* Protection Card */}
            <Card className="flex flex-col items-center p-6 text-center shadow-lg rounded-lg bg-white dark:bg-gray-900">
              <div className="bg-agribeta-orange rounded-full h-12 w-12 flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
              <CardTitle className="text-agribeta-orange text-2xl font-bold mb-4">PROTECTION</CardTitle>
              <ul className="text-gray-700 text-lg space-y-2 list-disc list-inside">
                <li>Precision agriculture</li>
                <li>Technology, data & innovative practices</li>
                <li>Optimize efficiency, precision & sustainability of agricultural operations</li>
              </ul>
              <ShieldCheck
                className="mt-6 h-24 w-24 text-agribeta-green"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* OUR VALUES Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-12">
          <h2 className="text-5xl font-extrabold tracking-tighter text-agribeta-orange drop-shadow-lg">
            OUR VALUES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 w-full max-w-7xl">
            <div className="flex flex-col items-center space-y-4 group">
              <Gem className="h-16 w-16 text-agribeta-green transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
              <p className="text-xl font-semibold text-agribeta-green transition-colors duration-300 group-hover:text-agribeta-orange">
                Integrity
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <Leaf className="h-16 w-16 text-agribeta-green transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
              <p className="text-xl font-semibold text-agribeta-green transition-colors duration-300 group-hover:text-agribeta-orange">
                Resilience
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <Lightbulb className="h-16 w-16 text-agribeta-green transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
              <p className="text-xl font-semibold text-agribeta-green transition-colors duration-300 group-hover:text-agribeta-orange">
                Clarity
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <Zap className="h-16 w-16 text-agribeta-green transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
              <p className="text-xl font-semibold text-agribeta-green transition-colors duration-300 group-hover:text-agribeta-orange">
                Empowerment
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 group">
              <Sparkles className="h-16 w-16 text-agribeta-green transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
              <p className="text-xl font-semibold text-agribeta-green transition-colors duration-300 group-hover:text-agribeta-orange">
                Innovation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
