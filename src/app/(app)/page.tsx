'use client'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/message.json'
import Link from 'next/link'

// Variants for scroll animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8 },
  }),
}

export default function HomePage() {

  return (
    <>
      <main className="relative flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-100">

        {/* --- Background Shapes --- */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute w-80 h-80 bg-purple-300 opacity-30 rounded-full -top-20 -left-20 animate-pulse" />
          <div className="absolute w-64 h-64 bg-blue-200 opacity-30 rounded-full bottom-10 right-10 animate-ping" />
        </div>

        {/* --- Hero Section --- */}
        <section className="text-center max-w-5xl space-y-8 mb-16 z-10">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Dive into the World of{" "}
            <span className="text-purple-600">Anonymous Conversations</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={1}
            className="text-xl text-gray-700 max-w-2xl mx-auto"
          >
            Explore <span className="font-semibold">Mystery Message</span>, where your identity remains a secret and honesty finds its voice. Share and receive messages anonymously with ease.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={2}
          >
            <Link href="/sign-up" >
            <Button
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
            </Link>
          </motion.div>
        </section>

        {/* --- Carousel Section --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={3}
          className="w-full max-w-4xl z-10"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">What People Are Saying</h2>

          <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-white shadow-md">
                      <CardHeader className="text-md font-semibold text-gray-700">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                        <span className="text-lg text-gray-800 text-center font-medium">
                          {message.content}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Received: {message.received}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.section>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full text-center py-6 bg-white text-sm text-gray-500 border-t z-10">
        © 2025 <span className="font-medium">Mystery Message</span>. All rights reserved.
      </footer>
    </>
  )
}
