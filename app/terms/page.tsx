import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-agribeta-green">
            Terms of Service
          </CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using AgriBeta's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily access AgriBeta for personal, non-commercial transitory 
              viewing only. This is the grant of a license, not a transfer of title, and under this license 
              you may not modify or copy the materials.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Service Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              AgriBeta provides agricultural technology services including crop diagnosis, weather monitoring, 
              agronomist consultations, and farming resources. We strive to provide accurate information 
              but cannot guarantee the effectiveness of all recommendations.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">4. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree 
              to accept responsibility for all activities that occur under your account or password.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may not use our service for any unlawful purpose or to solicit others to perform unlawful 
              acts. You may not violate any international, federal, provincial, or state regulations, rules, 
              laws, or local ordinances.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information on this service is provided on an 'as is' basis. To the fullest extent permitted 
              by law, AgriBeta excludes all representations, warranties, conditions and terms relating to our 
              service and the use of this service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall AgriBeta or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising out 
              of the use or inability to use the service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@agribeta.com" className="text-agribeta-green hover:underline">
                legal@agribeta.com
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
