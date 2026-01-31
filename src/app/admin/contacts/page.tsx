"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, Calendar, MessageSquare, CheckCircle, XCircle, Eye, Reply, Trash2, Filter, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { getContacts, updateContactStatus, deleteContact } from "@/lib/actions/contacts"
import { formatDateTime, formatDateReadable } from "@/lib/utils/date-format"

export default function ContactsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    setLoading(true)
    const { data, error } = await getContacts()
    if (data) {
      setContacts(data)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await updateContactStatus(id, status)
    if (!error) {
      loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status })
      }
    } else {
      alert("Error updating status: " + error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return
    
    const { error } = await deleteContact(id)
    if (!error) {
      loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
    } else {
      alert("Error deleting inquiry: " + error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = contacts.filter(i => i.status === "pending").length
  const repliedCount = contacts.filter(i => i.status === "replied").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Contact Inquiries</h1>
          <p className="text-slate-600">Manage all customer inquiries and messages</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-orange-100 px-4 py-2 rounded-xl border border-orange-200">
            <p className="text-xs text-orange-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Replied</p>
            <p className="text-2xl font-bold text-blue-700">{repliedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Card className="border-slate-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 text-lg">No inquiries found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{contact.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span>{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4 text-blue-600" />
                                  <span>{contact.phone}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={cn(
                          "px-3 py-1 text-xs font-semibold rounded-full",
                          contact.status === "replied" 
                            ? "bg-blue-100 text-blue-700" 
                            : contact.status === "closed"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-orange-100 text-orange-700"
                        )}>
                          {contact.status}
                        </span>
                      </div>

                      {contact.subject && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">{contact.subject}</h4>
                        </div>
                      )}

                      <div>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {contact.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Received: {formatDateTime(contact.created_at)}</span>
                        </div>
                        {contact.replied_at && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Replied: {formatDateTime(contact.replied_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedContact(contact)}
                        className="w-full rounded-xl border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                      {contact.status === "pending" && (
                        <Button
                          onClick={() => handleStatusUpdate(contact.id, 'replied')}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
                        >
                          <Reply className="w-4 h-4 mr-2" /> Mark as Replied
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(contact.id)}
                        className="w-full rounded-xl hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Inquiry Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1 block">Name</label>
                    <p className="text-lg font-semibold text-slate-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1 block">Status</label>
                    <span className={cn(
                      "inline-block px-3 py-1 text-sm font-semibold rounded-full",
                      selectedContact.status === "replied" 
                        ? "bg-blue-100 text-blue-700" 
                        : selectedContact.status === "closed"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-orange-100 text-orange-700"
                    )}>
                      {selectedContact.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500 mb-1 block">Email</label>
                  <p className="text-slate-900">{selectedContact.email}</p>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1 block">Phone</label>
                    <p className="text-slate-900">{selectedContact.phone}</p>
                  </div>
                )}

                {selectedContact.subject && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1 block">Subject</label>
                    <p className="text-lg font-semibold text-slate-900">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-slate-500 mb-1 block">Message</label>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1 block">Received</label>
                    <p className="text-slate-900">{formatDateTime(selectedContact.created_at)}</p>
                  </div>
                  {selectedContact.replied_at && (
                    <div>
                      <label className="text-sm font-semibold text-slate-500 mb-1 block">Replied</label>
                      <p className="text-slate-900">{formatDateTime(selectedContact.replied_at)}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContact(null)}
                    className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50"
                  >
                    Close
                  </Button>
                  {selectedContact.status === "pending" && (
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedContact.id, 'replied')
                        setSelectedContact(null)
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
                    >
                      <Reply className="w-4 h-4 mr-2" /> Mark as Replied
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedContact.id)
                      setSelectedContact(null)
                    }}
                    className="rounded-xl hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
