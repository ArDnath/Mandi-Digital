"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2, GalleryVerticalEnd } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "@/server/users"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const {success, message} =await signIn(values.email, values.password);

    if(success){
      toast.success(message as string);
      
      // Broadcast auth change to navbar
      if (typeof window !== "undefined") {
        const channel = new BroadcastChannel("auth");
        channel.postMessage({ type: "AUTH_CHANGE" });
        channel.close();
      }
      
      router.push("/cart")
    }
    else{
      toast.error(message as string);
    }

    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-2">
            <GalleryVerticalEnd className="size-6" />
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Don&apos;t have an account? <a href="/sign-up">Sign up</a>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                <Field>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                <Field>
                  <Button disabled={loading} type="submit" className="w-full">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : "Login"}
                  </Button>
                </Field>
              </FieldGroup>

              <div className="relative my-4 flex items-center">
                <div className="grow border-t border-muted" />
                <span className="px-3 text-sm text-muted-foreground">Or</span>
                <div className="grow border-t border-muted" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" type="button">
                  Continue with Apple
                </Button>
                <Button variant="outline" type="button">
                  Continue with Google
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
