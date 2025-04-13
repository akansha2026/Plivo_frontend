'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 text-zinc-900">
      <div className="p-8 rounded-xl w-full max-w-xl text-center space-y-6 shadow-sm transform transition-all duration-300 hover:scale-105">
        <h1 className="text-5xl font-extrabold text-zinc-900">
        StatusApp
        </h1>
        <p className="text-xl text-zinc-700">
          Real-time updates. Transparent communication. Stay informed effortlessly.
        </p>

        <div className="pt-6">
          <Link href="/login">
            <Button size="lg" className="bg-zinc-800 text-white hover:bg-zinc-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-300 transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}