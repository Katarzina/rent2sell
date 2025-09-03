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
      <SwaggerUI 
        spec={spec}
        requestInterceptor={(req) => {
          // Get the session token from cookies
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=').map(c => c.trim());
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          
          const sessionToken = cookies['next-auth.session-token'];
          
          if (sessionToken) {
            req.headers = {
              ...req.headers,
              'Authorization': `Bearer ${sessionToken}`,
            };
          }
          return req;
        }}
      />
    </div>
  )
}