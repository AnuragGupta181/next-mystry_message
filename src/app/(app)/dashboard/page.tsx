'use client'

import { Message } from '@/model/User'
import React, { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Loader2, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'


const DashboardPage = () => {
  const [messages, setMessages] = useState<(Message & { _id: string })[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')

  const { data: session, status } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessage')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch message settings')
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessage = useCallback(async (refresh = false) => {
    setIsLoading(true)
    try {
      const res = await axios.get<ApiResponse>('/api/get-messages')
      setMessages((res.data.messages ?? []) as (Message & { _id: string })[]);
      console.log('Fetched messages:', res.data.messages)
      if (refresh) toast('Showing latest message')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await axios.delete(`/api/delete-message/${messageId}`)
      if (res.data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== messageId))
        toast.success('Message deleted successfully.')
      } else {
        toast.error(res.data.error || 'Failed to delete message.')
      }
    } catch {
      toast.error('Error deleting message.')
    }
  }

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessage: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Failed to update setting')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast('Profile URL copied to clipboard!')
  }

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessage()
    fetchAcceptMessage()

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    setProfileUrl(`${baseUrl}/u/${session.user.username}`)
  }, [session, fetchMessage, fetchAcceptMessage])

  if (status === 'loading') {
    return <div className="text-center mt-10 text-lg">Loading session...</div>
  }

  if (!session?.user?.username) {
    return <div className="text-center mt-10 text-lg">Error: Username not found in session.</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75" />
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-150" />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="my-30 mx-4 md:mx-8 lg:mx-auto p-8 bg-white/70 backdrop-blur-xl rounded-2xl w-full max-w-6xl shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">User Dashboard</h1>

        {/* Profile Link Copy */}
        <div className="mb-6">
          <Label className="text-gray-700 font-medium">Your Profile Link</Label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        {/* Accept Message Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <Label htmlFor="acceptToggle">Accept Messages</Label>
          <Switch
            {...register('acceptMessage')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            id="acceptToggle"
          />
          <span className="text-gray-600">{acceptMessages ? 'On' : 'Off'}</span>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <Button variant="outline" onClick={() => fetchMessage(true)}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
        </div>

        {/* Messages Grid */}
        {messages.length > 0 ? (
          <div className="grid gap-4 mt-6 w-full">
            {messages.map((msg) => (
              <Card key={String(msg._id)} className="border border-gray-200 rounded-xl shadow hover:shadow-md transition">
                <CardContent className="p-4 space-y-3">
                  <p className="text-base text-gray-800 break-words">
                    {msg.content?.trim() || "This message is empty."}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {new Date(msg.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <DeleteConfirmDialog onConfirm={() => handleDeleteMessage(msg._id)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-6">
            No messages yet.
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default DashboardPage
