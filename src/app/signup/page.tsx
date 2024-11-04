"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import google from "../../assets/google.png";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleGoogleSignup } from "./serverAction";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const { mutate: newUser, isPending } = useMutation({
    mutationFn: async (newUser: SignupFormInputs) => {
      const response = await axios.post("/api/signup", newUser);
      return response.data; // Return data if success
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response) {
        const backendMessage = error.response.data.message; // Backend se aaya message
        toast.error(backendMessage); // Show the backend message in alert
      } else {
        console.log(error);
        alert("Something went wrong. Please try again.");
      }
    },
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });

  const onSubmit = (data: SignupFormInputs) => {
    newUser(data);
  };

  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring focus:ring-blue-300 focus:outline-none`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring focus:ring-blue-300 focus:outline-none`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring focus:ring-blue-300 focus:outline-none`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Google Signup Button */}
        <form action={handleGoogleSignup}>
          <button
            type="submit"
            className="w-full py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring focus:ring-blue-300"
          >
            <div className="flex items-center justify-center">
              <Image
                src={google}
                alt="Google Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </div>
          </button>
        </form>
        <Link className="text-xs mt-2 w-full" href="/login">
          Already have an account? Login now!
        </Link>
      </div>
    </div>
  );
};

export default Signup;
