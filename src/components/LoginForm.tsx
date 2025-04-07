// src/components/LoginForm.tsx
import Cookies from "js-cookie";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://api.odensebartech.com/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const json = await res.json();

      // Save token and user info
      Cookies.set("access_token", json.access_token, { expires: 2 }); // expires in 2 days
      Cookies.set("username", json.username, { expires: 2 });
      Cookies.set("permissions", JSON.stringify(json.permissions), {
        expires: 2,
      });

      toast.success("Login successful", {
        description: `Welcome, ${json.username}`,
      });

      navigate("/dashboard/page1");
    } catch (err: any) {
      toast.error("Login failed", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              Sign In
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              <a href="#" className="hover:underline">
                Forgot your password?
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
