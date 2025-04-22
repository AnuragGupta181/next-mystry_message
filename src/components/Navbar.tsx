'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { User } from 'next-auth'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-white/70 shadow-md border-b-0'
          : 'bg-white shadow-md border-b-0'
      }`}
    >
      <div className="relative">
        {/* Glow Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 blur-md opacity-70"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">Mystery Message</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <strong>{user?.username || user?.email}</strong>
              </span>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
