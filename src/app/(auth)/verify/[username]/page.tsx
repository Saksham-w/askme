"use client";
import { ApiResponse } from "@/app/types/ApiResponse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { ArrowLeft, Loader2, Mail, MessageCircle } from "lucide-react";
import { set } from "mongoose";
import NextLink from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { string } from "zod";
import { fi } from "zod/locales";
import Link from "next/link";

// Page component for account verification
const VerifyAccount = () => {
  const router = useRouter(); // Next.js router for navigation
  const param = useParams<{ username: string }>(); // Get username parameter from URL
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 from-primary/10 via-transparent to-primary/5 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <NextLink
          href="/"
          className="flex items-center justify-center gap-3 mb-8 group"
          aria-label="True Feedback Home"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30 group-hover:bg-primary/30 transition-colors">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            ASK<span className="text-gradient">ME</span>
          </span>
        </NextLink>

        <Card className="glass border-glass-border backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Verify Your Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the verification code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Email info box */}
            <div className="mb-6 p-4 rounded-lg bg-secondary/30 border border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit code to the email associated with
              </p>
              <p className="text-primary font-medium mt-1">@{param.username}</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="bg-secondary/50 border-border focus:border-primary/50 h-12 text-center text-lg tracking-widest font-mono transition-colors"
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
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Verifying...
                    </>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </form>
            </Form>

            {/* Resend code */}
            {/* <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={() => toast.success("Verification code resent!")}
                  className="text-primary hover:underline font-medium transition-colors cursor-pointer"
                >
                  Resend
                </button>
              </p>
            </div> */}

            <div className="mt-6 pt-6 border-t border-border/50 cursor-pointer">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyAccount;
