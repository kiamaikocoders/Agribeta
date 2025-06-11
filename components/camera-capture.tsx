"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw } from "lucide-react"

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void
}

export function CameraCapture({ onImageCapture }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/png")
        setCapturedImage(imageData)
        onImageCapture(imageData)
        stopCamera()
      }
    }
  }, [onImageCapture, stopCamera])

  const resetCapture = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  // Start camera when component mounts
  useState(() => {
    startCamera()

    // Cleanup when component unmounts
    return () => {
      stopCamera()
    }
  })

  return (
    <div className="w-full">
      <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <Button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-agribeta-green hover:bg-agribeta-green/90"
              onClick={captureImage}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </>
        ) : (
          <>
            <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={resetCapture}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
