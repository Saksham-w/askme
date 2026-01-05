"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { set } from "mongoose";

// Page component for sign-in
const page = () => {
  const [username, setUsername] = useState(""); // State for username input
  const [usernameMessage, setUsernameMessage] = useState(""); // State for username availability message
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); // State to indicate if username check is in progress
  const [isSubmitting, setIsSubmitting] = useState(false); // State to indicate if form submission is in progress
  const debouncedUsername = useDebounceValue(username, 300); // Debounced username value
  const router = useRouter(); // Next.js router for navigation

  // React Hook Form setup with Zod validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  // Effect to check username uniqueness when debounced username changes
  useEffect(() => {
    const checkUsername = async () => {
      // Function to check username uniqueness
      if (debouncedUsername) {
        // Only check if username is not empty
        setIsCheckingUsername(true); // Set checking state to true
        setUsernameMessage(""); // Clear previous message
        try {
          // Make API call to check username uniqueness with debounced username
          const response = await axios.get(
            `/api/username-check?username=${debouncedUsername}`
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
  }, [debouncedUsername]);

  return <div>page</div>;
};

export default page;
