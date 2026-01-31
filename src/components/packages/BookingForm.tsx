"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Mail, Phone, MessageSquare, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { createBooking } from "@/lib/actions/bookings"

export default function BookingForm({ 
  packageId, 
  packageTitle, 
  price 
}: { 
  packageId: string
  packageTitle: string
  price: number 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    persons: 1,
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'persons' ? parseInt(value) || 1 : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const { data, error: actionError } = await createBooking({
        packageId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        persons: formData.persons,
        message: formData.message
      })

      if (actionError) {
        setError(actionError)
        setLoading(false)
      } else {
        setSuccess(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          persons: 1,
          message: ""
        })
        setLoading(false)
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <Card className="sticky top-24 border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
        <CardTitle className="text-2xl font-serif font-bold mb-2">Book This Tour</CardTitle>
        <p className="text-blue-100 text-lg font-medium">From ₹{price.toLocaleString()} / person</p>
      </CardHeader>
      <CardContent className="p-8">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-700">
              Thank you! Your booking request has been received. We will contact you shortly.
            </p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Full Name
            </label>
            <Input 
              name="name"
              placeholder="Your Name" 
              required 
              value={formData.name}
              onChange={handleChange}
              className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" /> Phone Number
            </label>
            <Input 
              name="phone"
              placeholder="+91 XXXXX XXXXX" 
              required 
              value={formData.phone}
              onChange={handleChange}
              className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> Email Address
            </label>
            <Input 
              name="email"
              type="email" 
              placeholder="you@example.com" 
              required 
              value={formData.email}
              onChange={handleChange}
              className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Travel Date
              </label>
              <Input 
                name="date"
                type="date" 
                required 
                value={formData.date}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Persons
              </label>
              <Input 
                name="persons"
                type="number" 
                min="1" 
                required 
                value={formData.persons}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Message (Optional)
            </label>
            <Textarea 
              name="message"
              placeholder="Any special requests?" 
              value={formData.message}
              onChange={handleChange}
              className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
            />
          </div>

          <Button 
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-7 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Enquiry
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-slate-500 mt-3 leading-relaxed">
            Our team will contact you within 24 hours to confirm availability.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
