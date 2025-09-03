'use client'

import { useEffect } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocs() {
  useEffect(() => {
    // Fix for swagger-ui-react not loading in Next.js
    const style = document.createElement('style')
    style.innerHTML = '.swagger-ui .wrapper { padding: 0 20px }'
    document.head.appendChild(style)
  }, [])

  return (
    <div className="pt-16">
      <SwaggerUI url="/api/api-docs" />
    </div>
  )
}