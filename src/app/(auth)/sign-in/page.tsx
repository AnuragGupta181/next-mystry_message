'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const Page = () => {
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const resultCredentials = await signIn('credentials',{
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })
    if (resultCredentials?.error) {
      toast.error("Invalid credentials")
    }
    if (resultCredentials?.url){
      router.replace('/dashboard')
    }
    else {
      console.error("Sign-in error:", resultCredentials)
      console.log("error in signin: ", resultCredentials?.error || "unknown error in signin") 
      toast.error("An error occurred during sign-in")
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
            Sign in to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit = {form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email / Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username or Email" {...field} />
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
        <Button type="submit">
            SignIn
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4 font-bold">OR</div>
        <div className="text-center mt-4">
          <Button
            className="w-full max-w-xs mx-auto"
            variant="outline"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page