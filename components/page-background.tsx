import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PageBackgroundProps {
  imageSrc: string
  alt?: string
  opacity?: number
  className?: string
  children: React.ReactNode
}

export function PageBackground({
  imageSrc,
  alt = "Background",
  opacity = 0.1,
  className,
  children,
}: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={cn("object-cover", `opacity-${Math.round(opacity * 100)}`)}
          priority
        />
      </div>

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  )
}
