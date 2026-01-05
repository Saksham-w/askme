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
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Page component for sign-up
const page = () => {
  const [username, setUsername] = useState(""); // State for username input
  const [usernameMessage, setUsernameMessage] = useState(""); // State for username availability message
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); // State to indicate if username check is in progress
  const [isSubmitting, setIsSubmitting] = useState(false); // State to indicate if form submission is in progress
  const debounced = useDebounceCallback(setUsername, 300); // Debounced username value ie the username state updated after 300ms of inactivity
  const router = useRouter(); // Next.js router for navigation

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
      router.replace(`/verify/${username}`); // Redirect to sign-in page
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        {/* Sign-up form component from ui/form.tsx */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className="text-gray-400 text-sm">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
