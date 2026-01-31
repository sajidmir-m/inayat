"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createJourney } from "@/lib/actions/journeys"
import { compressImage, validateImageFile } from "@/lib/utils/image-compression"

export default function NewJourneyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])
  const [compressing, setCompressing] = useState(false)

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validationError = validateImageFile(file, 10) // Allow up to 10MB before compression
    if (validationError) {
      setError(validationError)
      return
    }

    setCompressing(true)
    setError("")

    try {
      // Compress image before setting
      const compressedFile = await compressImage(file, 1920, 1080, 0.85, 2)
      setMainImage(compressedFile)
      setMainImagePreview(URL.createObjectURL(compressedFile))
      
      if (compressedFile.size < file.size) {
        const originalSize = (file.size / 1024 / 1024).toFixed(2)
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2)
        console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`)
      }
    } catch (err) {
      console.error('Image compression error:', err)
      // If compression fails, use original file
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    } finally {
      setCompressing(false)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAdditionalImages([...additionalImages, ...files])
    files.forEach(file => {
      setAdditionalPreviews([...additionalPreviews, URL.createObjectURL(file)])
    })
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
    setAdditionalPreviews(additionalPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    if (mainImage) {
      formData.append('mainImage', mainImage)
    }
    additionalImages.forEach(img => {
      formData.append('additionalImages', img)
    })

    const { data, error: actionError } = await createJourney(formData)
    
    if (actionError) {
      setError(actionError)
      setLoading(false)
    } else {
      router.push('/admin/journeys')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/journeys">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Create New Journey</h1>
          <p className="text-slate-600">Add a new travel package to your offerings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Journey Title *</label>
                  <Input name="title" required className="rounded-xl" placeholder="e.g., Majestic Kashmir Tour" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Price (₹) *</label>
                    <Input name="price" type="number" required className="rounded-xl" placeholder="18500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Duration *</label>
                    <Input name="duration" required className="rounded-xl" placeholder="e.g., 5 Days / 4 Nights" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Days *</label>
                    <Input name="days" type="number" required className="rounded-xl" placeholder="5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nights *</label>
                    <Input name="nights" type="number" required className="rounded-xl" placeholder="4" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location *</label>
                    <Input name="location" required className="rounded-xl" placeholder="Srinagar, Gulmarg, Pahalgam" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category *</label>
                    <select name="category" required className="w-full h-10 rounded-xl border border-slate-200 px-3 focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Category</option>
                      <option value="Family">Family</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Group">Group</option>
                      <option value="Offbeat">Offbeat</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description *</label>
                  <Textarea name="description" required className="rounded-xl min-h-[120px]" placeholder="Describe the journey..." />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Main Image *</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    {compressing ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                        <p className="text-sm text-slate-600">Compressing image...</p>
                      </div>
                    ) : mainImagePreview ? (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden">
                        <Image src={mainImagePreview} alt="Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImage(null)
                            setMainImagePreview(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300">
                          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                          <p className="text-slate-600 font-medium mb-1">Click to upload main image</p>
                          <p className="text-xs text-slate-500">JPG, PNG or WebP (max 10MB, auto-compressed)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          disabled={compressing}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>
                  {mainImagePreview && !compressing && mainImage && (
                    <p className="text-xs text-slate-500 text-center">
                      Image ready ({mainImage.size > 1024 * 1024 
                        ? `${(mainImage.size / 1024 / 1024).toFixed(2)}MB` 
                        : `${(mainImage.size / 1024).toFixed(0)}KB`})
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Additional Images</label>
                  <div className="grid grid-cols-3 gap-4">
                    {additionalPreviews.map((preview, index) => (
                      <div key={index} className="relative h-32 rounded-xl overflow-hidden border-2 border-slate-200">
                        <Image src={preview} alt={`Additional ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <Upload className="w-6 h-6 text-slate-400" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select name="status" className="w-full h-10 rounded-xl border border-slate-200 px-3 focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="featured" value="true" className="w-4 h-4 rounded" />
                    <span className="text-sm font-semibold text-slate-700">Featured Journey</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Link href="/admin/journeys" className="flex-1">
                <Button type="button" variant="outline" className="w-full rounded-xl">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Journey"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

