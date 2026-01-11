"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { Check, Loader2, MessageCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Page component for sign-up
const page = () => {
  const [username, setUsername] = useState(""); // State for username input
  const [usernameMessage, setUsernameMessage] = useState(""); // State for username availability message
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); // State to indicate if username check is in progress
  const [isSubmitting, setIsSubmitting] = useState(false); // State to indicate if form submission is in progress
  const debounced = useDebounceCallback(setUsername, 300); // Debounced username value ie the username state updated after 300ms of inactivity
  const router = useRouter(); // Next.js router for navigation
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form setup with Zod validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      // Default form values ie data's value in the onsubmit function below
      email: "",
      password: "",
      username: "",
    },
  });

  // Effect to check username uniqueness when debounced username changes
  useEffect(() => {
    const checkUsername = async () => {
      // Function to check username uniqueness
      if (username) {
        // Only check if username is not empty
        setIsCheckingUsername(true); // Set checking state to true
        setUsernameMessage(""); // Clear previous message
        try {
          // Make API call to check username uniqueness with debounced username
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message); // Set success message from response
        } catch (error) {
          // Handle errors from API call
          const axiosError = error as AxiosError<ApiResponse>; // Type assertion for AxiosError
          setUsernameMessage(
            // Set error message from response or default message
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false); // Set checking state to false
        }
      }
    };
    checkUsername();
  }, [username]);

  // Function to handle form submission
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true); // Set submitting state to true
    try {
      // Make API call to sign up the user with form data where data contains email, password, username
      const response = await axios.post<ApiResponse>("/api/signUp", data);
      toast.success(response.data.message); // Show success toast message
      router.replace(`/verify/${data.username}`); // Redirect to verification page
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle errors from API call
      const axiosError = error as AxiosError<ApiResponse>; // Type assertion for AxiosError
      toast.error(
        // Show error toast message from response or default message
        axiosError.response?.data.message || "Error signing up"
      );
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const features = [
    "Receive unlimited anonymous messages",
    "AI-powered message suggestions",
    "Custom shareable link",
    "Message moderation tools",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
          aria-label="AskMe Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            ASK<span className="text-primary">ME</span>
          </span>
        </Link>

        <Card className="glass border-glass-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your inbox</CardTitle>
            <CardDescription>
              Start receiving anonymous feedback today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Features list */}
            <div className="mb-6 space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check
                    className="h-4 w-4 text-primary shrink-0"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          className="bg-secondary/50 border-border focus:border-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        This will be your unique link: askme.app/u/
                        {field.value || "username"}
                      </FormDescription>
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
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="bg-secondary/50 border-border focus:border-primary/50"
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
                          className="bg-secondary/50 border-border focus:border-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/30 hover:text-foreground h-11 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:bg-primary/20 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
