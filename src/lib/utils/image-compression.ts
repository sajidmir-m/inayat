/**
 * Compress image file to reduce size before upload
 * @param file - Original image file
 * @param maxWidth - Maximum width (default: 1920)
 * @param maxHeight - Maximum height (default: 1080)
 * @param quality - JPEG quality 0-1 (default: 0.85)
 * @param maxSizeMB - Maximum file size in MB (default: 2)
 * @returns Compressed File or original if compression fails
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85,
  maxSizeMB: number = 2
): Promise<File> {
  // If file is already small enough, return as is
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size <= maxSizeBytes) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // If compression fails, return original
              resolve(file)
              return
            }
            
            // Check if compressed size is acceptable
            if (blob.size <= maxSizeBytes) {
              const compressedFile = new File([blob], file.name, {
                type: blob.type || 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              // If still too large, try with lower quality
              if (quality > 0.5) {
                canvas.toBlob(
                  (lowerQualityBlob) => {
                    if (!lowerQualityBlob) {
                      resolve(file)
                      return
                    }
                    const compressedFile = new File([lowerQualityBlob], file.name, {
                      type: lowerQualityBlob.type || 'image/jpeg',
                      lastModified: Date.now(),
                    })
                    resolve(compressedFile)
                  },
                  'image/jpeg',
                  quality * 0.7 // Reduce quality further
                )
              } else {
                // If quality is already low, return original
                resolve(file)
              }
            }
          },
          'image/jpeg', // Convert to JPEG for better compression
          quality
        )
      }
      
      img.onerror = () => {
        // If image load fails, return original
        resolve(file)
      }
      
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => {
      // If read fails, return original
      resolve(file)
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 5)
 * @returns Error message or null if valid
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): string | null {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    return 'File must be an image'
  }
  
  // Check file size
  if (file.size > maxSizeBytes) {
    return `Image size must be less than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
  }
  
  return null
}

