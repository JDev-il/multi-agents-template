import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { StyledComponentsRegistry } from '@/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'agentic flow test',
  description: 'agentic flow test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
