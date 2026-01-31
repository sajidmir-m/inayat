"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function TestConnectionPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const testConnection = async () => {
    setLoading(true)
    setResults(null)

    try {
      // Test 1: Check environment variables
      const envCheck = {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }

      // Test 2: Test server action
      const response = await fetch('/api/test-connection')
      const serverTest = await response.json()

      setResults({
        env: envCheck,
        server: serverTest,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      setResults({
        error: error.message || 'Test failed',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 text-center">
            <CardTitle className="text-3xl font-serif font-bold">Test Connection</CardTitle>
            <p className="text-blue-100 mt-2">Check Supabase Configuration</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Button
                onClick={testConnection}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 rounded-xl font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>

              {results && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Environment Variables</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {results.env?.hasUrl ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>NEXT_PUBLIC_SUPABASE_URL: {results.env?.url}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {results.env?.hasKey ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {results.env?.key}</span>
                      </div>
                    </div>
                  </div>

                  {results.server && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-3">Server Connection</h3>
                      <pre className="text-xs bg-white p-3 rounded border border-slate-200 overflow-auto">
                        {JSON.stringify(results.server, null, 2)}
                      </pre>
                    </div>
                  )}

                  {results.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      <AlertCircle className="w-5 h-5 inline mr-2" />
                      <span>{results.error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

