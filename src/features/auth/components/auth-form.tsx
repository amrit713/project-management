"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";

import { FIELD_NAMES, FIELD_PLACEHOLDER, FIELD_TYPES } from "@/constants";

import { DottedSeperator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader } from "lucide-react";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => void;
  isLoading: boolean;

  type: "SIGN_IN" | "SIGN_UP";
}

export const AuthForm = <T extends FieldValues>({
  type,
  defaultValues,
  onSubmit,
  schema,
  isLoading = false,
}: Props<T>) => {
  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const onSubmitHandler: SubmitHandler<T> = (values) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full h-full md:w-[480px] shadow-none rounded-lg">
      <CardHeader className="flex items-center flex-col justify-center text-center px-8 py-4">
        <CardTitle className="flex flex-col w-full items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={60} height={60} />
          <h1 className="font-semibold text-2xl">
            {" "}
            {isSignIn ? "Welcome back!" : "Create your library account"}
          </h1>
        </CardTitle>
        <CardDescription>
          {isSignIn ? (
            "Access the vast collection of resources, and stay updated"
          ) : (
            <>
              By signing up, you agree to our{" "}
              <span className="text-primary">privacy Policy</span> and{" "}
              <span className="text-primary">Terms of Services</span>{" "}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <div className="px-8 mb-2">
        <DottedSeperator />
      </div>
      <CardContent className="px-8 py-4">
        <Form {...form}>
          <form
            action=""
            className="space-y-4 w-full"
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            {Object.keys(defaultValues).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        disabled={isLoading}
                        placeholder={
                          FIELD_PLACEHOLDER[
                            field.name as keyof typeof FIELD_PLACEHOLDER
                          ]
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isSignIn ? "Sign In" : "Sign Up"}{" "}
              {isLoading && (
                <Loader className={"size-4 ml-2 animate-spin transition "} />
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center text-base font-medium mt-2">
          {isSignIn ? "Doesn't have an account? " : "Already have an account? "}

          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="transition text-primary font-semibold hover:underline"
          >
            {isSignIn ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </CardContent>
      <CardFooter className=" flex gap-4 -mt-4 ">
        <Button variant={"outline"} className="flex-1">
          <FaGoogle />
          Google
        </Button>
        <Button variant={"outline"} className="flex-1">
          <FaGithub />
          Github{" "}
        </Button>
      </CardFooter>
    </Card>
  );
};
