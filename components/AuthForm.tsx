"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { getLoggedInUser, signUp } from "../lib/actions/user.actions";
import { signIn } from "../lib/actions/user.actions";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// const formSchema = z.object({
//   email: z.string().email(),
//   // password: z.password().password()
// });

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // sign up with Appwrite and create plaid
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    console.log(data);
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link className="cursor-pointer flex items-center gap-1 " href="/">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Na Moni
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sing-In" : "Sign-Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* {PlaidLink} */}</div>
      ) : (
        //  FORM
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      control={form.control}
                    />
                    <CustomInput
                      name="lastName"
                      label="Last Name"
                      placeholder="ex: Demola"
                      control={form.control}
                    />
                  </div>

                  <CustomInput
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                    control={form.control}
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      name="state"
                      label="State"
                      placeholder="Example: Lag"
                      control={form.control}
                    />
                    <CustomInput
                      name="city"
                      label="City"
                      placeholder="Example: Ikeja"
                      control={form.control}
                    />
                    <CustomInput
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 1344"
                      control={form.control}
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                      control={form.control}
                    />
                    <CustomInput
                      name="ssn"
                      label="NIN"
                      placeholder="Example: 4729920394"
                      control={form.control}
                    />
                  </div>
                </>
              )}
              <CustomInput
                name="email"
                label="Email"
                placeholder="Enter your email"
                control={form.control}
              />
              <CustomInput
                name="password"
                label="Password"
                placeholder="Enter your password"
                control={form.control}
              />

              <div className="flex flex-col gap-4">
                <Button disabled={isLoading} className="form-btn" type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex gap-1 justify-center">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Dont have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "sign-up" : "sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign-Up" : "Sign-In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;