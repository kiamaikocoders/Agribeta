/**
 * Preprocesses an image for better disease pinpointing
 * @param imageData Base64 encoded image data
 * @returns Promise with processed image data
 */
export async function preprocessImage(imageData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Set canvas dimensions
        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Apply image processing techniques

        // 1. Enhance contrast
        const contrast = 1.2 // Increase contrast by 20%
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

        for (let i = 0; i < data.length; i += 4) {
          // Red
          data[i] = factor * (data[i] - 128) + 128
          // Green
          data[i + 1] = factor * (data[i + 1] - 128) + 128
          // Blue
          data[i + 2] = factor * (data[i + 2] - 128) + 128
          // Alpha channel remains unchanged
        }

        // 2. Enhance green channel for better plant disease pinpointing
        for (let i = 0; i < data.length; i += 4) {
          // Slightly boost green channel for plant disease pinpointing
          data[i + 1] = Math.min(255, data[i + 1] * 1.1)
        }

        // Put processed image data back on canvas
        ctx.putImageData(imageData, 0, 0)

        // Convert canvas to base64
        const processedImageData = canvas.toDataURL("image/jpeg", 0.9)
        resolve(processedImageData)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image for preprocessing"))
      }

      img.src = imageData
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Validates if the file is a valid image
 * @param file File to validate
 * @returns Object with validation result
 */
export function validateImage(file: File): { valid: boolean; message?: string } {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, message: "File must be an image" }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return { valid: false, message: "Image size must be less than 10MB" }
  }

  // Check image dimensions (will be done after loading)

  return { valid: true }
}
