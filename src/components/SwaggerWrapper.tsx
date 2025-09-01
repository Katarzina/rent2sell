'use client'

import { useEffect, useRef } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

interface SwaggerWrapperProps {
  spec: any
}

export default function SwaggerWrapper({ spec }: SwaggerWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Temporarily suppress console warnings for swagger-ui
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (
        args[0]?.includes?.('componentWillReceiveProps') ||
        args[0]?.includes?.('ModelCollapse') ||
        args[0]?.includes?.('OperationContain')
      ) {
        return
      }
      originalWarn.apply(console, args)
    }

    return () => {
      console.warn = originalWarn
    }
  }, [])

  return (
    <div ref={ref}>
      <SwaggerUI spec={spec} />
    </div>
  )
}