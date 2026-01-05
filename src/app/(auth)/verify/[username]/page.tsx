"use client";
import { ApiResponse } from "@/app/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { string } from "zod";
import { fi } from "zod/locales";

// Page component for account verification
const VerifyAccount = () => {
  const router = useRouter(); // Next.js router for navigation
  const param = useParams<{ username: string }>(); // Get username parameter from URL

  // React Hook Form setup with Zod validation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  // Form submission handler with API call to verify the account
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      // Make API call to verify the account with username and code
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });
      // Show success toast message and redirect to sign-in page
      toast.success(response.data.message);
      router.replace(`/sign-in`);
    } catch (error) {
      // Handle errors from API call
      console.error("Error verifying account:", error);
      const axiosError = error as AxiosError<ApiResponse>; // Type assertion for AxiosError
      toast.error(
        axiosError.response?.data.message || "Error verifying account"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        {/* Verification form component from ui/form.tsx */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
