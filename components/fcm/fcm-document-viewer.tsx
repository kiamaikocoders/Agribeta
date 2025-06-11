"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "@/components/search"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  content: React.ReactNode
}

export function FCMDocumentViewer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState("overview")
  const [highlightedText, setHighlightedText] = useState<string[]>([])

  const sections: Section[] = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">False Codling Moth (FCM) Management in Roses</h3>
          <p>
            A comprehensive guide to meet EU regulations (2019/2072 and 2024/2004) for exporting fresh cut roses to the
            European Union.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Zero Tolerance</CardTitle>
                <CardDescription>Critical compliance requirement</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Even one FCM detection results in lot rejection</p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">EU Compliance</CardTitle>
                <CardDescription>Regulatory framework</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Required under regulations 2019/2072 & 2024/2004</p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Systems Approach</CardTitle>
                <CardDescription>Implementation methodology</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Follows ISPM 14 international standards</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "identification",
      title: "FCM Identification",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">Critical Pest: Thaumatotibia leucotreta</h3>
          <p>EU-regulated quarantine pest requiring strict management</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Adult Moth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img src="/placeholder.svg?key=vk90h" alt="Adult FCM" className="w-full h-40 object-cover rounded-md" />
                <p>10-15mm wingspan, gray-brown with dark markings</p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Larvae</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src="/placeholder.svg?key=wh97q"
                  alt="FCM Larvae"
                  className="w-full h-40 object-cover rounded-md"
                />
                <p>Pink-white caterpillars up to 15mm, primary damaging stage</p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Damage Signs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src="/placeholder.svg?key=fcvi9"
                  alt="FCM Damage"
                  className="w-full h-40 object-cover rounded-md"
                />
                <p>Entry holes, frass, discoloration on rose stems and buds</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-agribeta-orange">Risk Areas</h4>
            <p>Warm, sheltered areas of greenhouse; damaged/stressed plants</p>
          </div>
        </div>
      ),
    },
    {
      id: "greenhouse",
      title: "Greenhouse Requirements",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">Structural Standards</h3>
          <p>Structural standards must be maintained at all times and verified through regular audits</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Structural Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Maintain polythene covers with no tears or damages; repair immediately if compromised. Regular
                  inspection is essential to prevent pest entry.
                </p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Insect-Proof Netting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  T7-20 mesh netting on all openings and vents; inspect weekly for damage. This mesh size is
                  specifically designed to prevent FCM entry while allowing adequate ventilation.
                </p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Entry/Exit Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Double-door systems with self-closing mechanism at all greenhouse entrances. This creates an airlock
                  effect that prevents direct entry of pests from the outside.
                </p>
              </CardContent>
            </Card>
            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Facility Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Register with KEPHIS (Kenya) or EAA (Ethiopia); obtain unique production site code. This code must be
                  included on all export documentation for traceability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "monitoring",
      title: "Monitoring Steps",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">Monitoring Protocol</h3>
          <p>
            Effective monitoring is the cornerstone of FCM management. Early detection allows for timely intervention
            and prevents export rejections.
          </p>

          <div className="space-y-6 mt-6">
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Monitoring Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Conduct all monitoring activities twice weekly with documented results. Consistency is key to
                  effective FCM management.
                </p>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Pheromone Traps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Install 4 traps per hectare</li>
                      <li>Check twice weekly</li>
                      <li>Replace lures every 4-6 weeks</li>
                      <li>Position at crop height</li>
                      <li>Record all catches with date and location</li>
                    </ul>
                  </div>
                  <div>
                    <img
                      src="/pheromone-trap-installation-thumbnail.png"
                      alt="Pheromone Trap"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Regular Scouting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  100% greenhouse coverage using alternating lines method; focus on high-risk areas. Scouting should be
                  systematic and thorough, with special attention to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Areas near vents and doors</li>
                  <li>Plants showing stress or damage</li>
                  <li>Warmer sections of the greenhouse</li>
                  <li>Previously affected areas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Data Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Document all trap catches and scouting observations; report to authorities monthly. Records must be
                  maintained for a minimum of 2 years and be available for inspection.
                </p>
              </CardContent>
            </Card>

            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Harvest Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Visual checks for FCM life stages before packhouse transfer; train staff on identification. This is
                  the final line of defense before product leaves the production area.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "compliance",
      title: "Compliance Checklist",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">Compliance Requirements</h3>
          <p>
            Meeting EU regulations requires strict adherence to established protocols and immediate action when issues
            are detected.
          </p>

          <div className="space-y-6 mt-6">
            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Corrective Action Protocol</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">If FCM is detected, follow these steps immediately:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Halt exports</span> from affected greenhouses
                  </li>
                  <li>
                    <span className="font-medium">Increase monitoring</span> with daily trapping/scouting for 5+ days
                  </li>
                  <li>
                    <span className="font-medium">Apply treatments</span> using approved pesticides
                  </li>
                  <li>
                    <span className="font-medium">Verify effectiveness</span> before resuming exports
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Packhouse Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>30% of lots must be sampled</li>
                  <li>Rejection if even one FCM is detected</li>
                  <li>Isolate and destroy rejected lots</li>
                  <li>Document all inspections and findings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Maintain records of all monitoring, treatments, and inspections for minimum 2 years. Documentation
                  must include:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Dates and times of all activities</li>
                  <li>Personnel involved</li>
                  <li>Findings and observations</li>
                  <li>Actions taken</li>
                  <li>Treatment details (products, rates, application methods)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Phytosanitary Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Obtain certificates from KEPHIS/EAA; ensure traceability codes are visible on bunches and
                  certificates. Each shipment must be accompanied by:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Valid phytosanitary certificate</li>
                  <li>Production site code</li>
                  <li>Declaration of compliance with EU regulations</li>
                  <li>Treatment records if applicable</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "ipm",
      title: "Integrated Pest Management",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">IPM Strategies for FCM Control</h3>
          <p>
            Effective FCM management requires an integrated approach combining biological, chemical, and cultural
            controls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Biological Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Cryptophlebia leucotreta granulovirus</span> - Specific viral pathogen
                    targeting FCM larvae
                  </li>
                  <li>
                    <span className="font-medium">Beauveria bassiana</span> - Entomopathogenic fungus effective against
                    multiple life stages
                  </li>
                  <li>
                    <span className="font-medium">Predatory insects</span> - Including certain wasps and bugs that
                    target FCM eggs and larvae
                  </li>
                  <li>
                    <span className="font-medium">Trichogramma</span> - Parasitic wasps that target FCM eggs
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Chemical Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Approved pesticides (follow label rates):</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Spinetoram</span> - Nerve action, effective against larvae
                  </li>
                  <li>
                    <span className="font-medium">Acephate</span> - Systemic organophosphate insecticide
                  </li>
                  <li>
                    <span className="font-medium">Belt (Flubendiamide)</span> - Targets larvae feeding behavior
                  </li>
                  <li>
                    <span className="font-medium">Coragen (Chlorantraniliprole)</span> - Effective against eggs and
                    early larval stages
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Cultural Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Remove and destroy infested material immediately</li>
                  <li>Maintain strict greenhouse hygiene</li>
                  <li>Eliminate plant debris and fallen flowers</li>
                  <li>Manage temperature and humidity to discourage FCM development</li>
                  <li>Implement proper pruning and plant spacing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Resistance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Rotate pesticide modes of action to prevent resistance development</li>
                  <li>Integrate multiple control strategies</li>
                  <li>Avoid consecutive applications of the same chemical group</li>
                  <li>Follow recommended application intervals and rates</li>
                  <li>Monitor treatment efficacy and adjust strategies as needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "principles",
      title: "Key Principles",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-agribeta-green">Key Principles of FCM Management</h3>
          <p>
            Successful FCM management is built on four fundamental principles that must be implemented as an integrated
            system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Prevention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Rigorous greenhouse standards to block FCM entry</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Structural integrity maintenance</li>
                  <li>Insect-proof netting on all openings</li>
                  <li>Double-door entry systems</li>
                  <li>Staff training on biosecurity protocols</li>
                  <li>Proper management of plant material movement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Systematic monitoring via traps and scouting</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Regular pheromone trap monitoring</li>
                  <li>Comprehensive scouting program</li>
                  <li>Staff training on FCM identification</li>
                  <li>Harvest inspection protocols</li>
                  <li>Documentation of all monitoring activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-green/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-green">Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Zero-tolerance policy with swift corrective measures</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Immediate action upon FCM detection</li>
                  <li>Integrated pest management implementation</li>
                  <li>Isolation of affected areas</li>
                  <li>Increased monitoring frequency</li>
                  <li>Verification of treatment effectiveness</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-agribeta-orange/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-agribeta-orange">Traceability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Unique site codes and documentation throughout process</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Production site registration and coding</li>
                  <li>Comprehensive record-keeping</li>
                  <li>Product labeling with traceability information</li>
                  <li>Documentation of all treatments and actions</li>
                  <li>Phytosanitary certification</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h4 className="font-medium text-agribeta-green">Regulatory References:</h4>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>EU Regulations 2019/2072 & 2024/2004</li>
              <li>ISPM 14 (Systems Approach)</li>
              <li>ISPM 31 (Sampling)</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setHighlightedText([])
      return
    }

    // Create an array of terms to highlight
    const terms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 2)
    setHighlightedText(terms)
  }

  // Function to highlight text based on search query
  const highlightText = (text: string) => {
    if (!searchQuery || highlightedText.length === 0) return text

    let highlightedContent = text
    highlightedText.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi")
      highlightedContent = highlightedContent.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-800">$1</span>')
    })

    return <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
  }

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? sections.filter((section) => {
        const sectionContent = JSON.stringify(section.content).toLowerCase()
        return searchQuery
          .toLowerCase()
          .split(" ")
          .some((term) => term.length > 2 && sectionContent.includes(term.toLowerCase()))
      })
    : sections

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-agribeta-green">FCM Management Document</h2>
        <Search onSearch={handleSearch} placeholder="Search document..." className="w-full md:w-auto" />
      </div>

      {searchQuery && (
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm">
            {filteredSections.length === 0
              ? "No results found for your search."
              : `Found matches in ${filteredSections.length} section(s).`}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" className="border-agribeta-green text-agribeta-green">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" className="border-agribeta-green text-agribeta-green">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="border-agribeta-green text-agribeta-green">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
          {sections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className={cn(
                "data-[state=active]:text-white",
                section.id === activeSection &&
                  (section.id === "overview" ||
                    section.id === "greenhouse" ||
                    section.id === "monitoring" ||
                    section.id === "principles")
                  ? "data-[state=active]:bg-agribeta-green"
                  : "data-[state=active]:bg-agribeta-orange",
              )}
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            {section.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
