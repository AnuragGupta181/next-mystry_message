'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
// import { useRouter } from "next/router"
import { useRouter } from "next/navigation"

import { useDebounceCallback } from 'usehooks-ts'

import { Loader2 } from "lucide-react"
import { toast } from "sonner"

//import { ToastAction } from "@/components/ui/toast"
//import { useToast } from "@/components/hooks/use-toast"

import { signUpSchema } from "@/schemas/signUpSchema"
import { set } from "mongoose"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const Page = () => {
  const [username, setUsername] = useState('')
  const [usernameMesssage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  // const {toast} = toast();
  const debounced = useDebounceCallback(setUsername, 300)

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUserNameUnique = async  () => {
      if (username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log("Response from check username API:", response.data.message)
          const message = response.data.message
          setUsernameMessage(message)
        
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? 'Error Checking username')
        } finally {
          setIsCheckingUsername(false)
        }
      }
    } 
    checkUserNameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success(response.data.message)   //TODO lec 10 44.14
      router.replace(`/verify/${username}`)
      
    } catch (error) {
      console.error("Error in signing up of user:", error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Error Signing up')

    } finally {
      setIsSubmitting(false)
    } 
  }
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="my-30 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit = {form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="example_123" {...field} 
                  onChange= {(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                  }} />                 
                </FormControl>
  
                {isCheckingUsername && (
                  <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Checking availability...
                  </div>
                )}

                {!isCheckingUsername && usernameMesssage && (
                  <p
                    className={`text-sm flex items-center gap-2 ${
                      usernameMesssage.startsWith("Username is unique")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {usernameMesssage.startsWith("Username is unique") ? "✅" : "❌"}
                    <span className="font-medium">{usernameMesssage}</span>
                  </p>
                )}
                <FormMessage />
              </FormItem>
           )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Example@2211" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button disabled={isSubmitting} type="submit">
          {
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </> 
            ) : ('Sign-Up')
          }
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already have an account ?{' '} 
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page