'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ReactNode } from 'react'

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isMaintenance = pathname === '/maintenance'

  return (
    <>
      {!isMaintenance && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isMaintenance && <Footer />}
    </>
  )
}
