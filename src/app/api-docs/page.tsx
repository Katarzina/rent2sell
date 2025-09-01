'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic import to avoid SSR issues
const SwaggerWrapper = dynamic(() => import('@/components/SwaggerWrapper'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading API documentation...</div>
})

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/swagger')
      .then(res => res.json())
      .then(data => setSpec(data))
  }, [])

  if (!mounted || !spec) {
    return <div className="flex items-center justify-center min-h-screen">Loading API documentation...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 px-4">API Documentation</h1>
        <SwaggerWrapper spec={spec} />
      </div>
    </div>
  )
}