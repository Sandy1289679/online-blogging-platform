import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Link,useNavigate } from "react-router-dom";
import { RouteSignin, } from "@/helper/RouteName";
import { getEnv } from "@/helper/getenv";
import { showToast } from "@/helper/showToast";
import GoogleLogin from "@/components/GoogleLogin";

const Signup = () => {
  const navigate=useNavigate()
  const formSchema = z.object({
    name:z.string().min(3,"name must be atleast 3 charcter long "),
    email:z.string().email(),
    password: z.string().min(8, "password must be atleast 8 charcter long "),
    confirmpassword: z.string().refine(data => data.password==data.confirmpassword,'password and confirm password should be same')
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });
  

 async function onSubmit(values) {
  try {
    const base = import.meta.env.VITE_API_BASE_URL; // rely on correct .env
    const url = `${base.replace(/\/$/, "")}/auth/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    // Safely parse JSON only if the server returned JSON
    let data = {};
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try { data = await response.json(); } catch {}
    }

    if (!response.ok) {
      showToast("error", data?.message || `Request failed ${response.status}`);
      return;
    }

    showToast("success", data?.message || "Account created");
    navigate(RouteSignin);
  } catch (error) {
    console.error("onSubmit error:", error);
    showToast("error", error?.message || "Network error — server may be down");
  }
}

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5">
          Create your Account
        </h1>
        <div className="flex flex-col items-center">
  <GoogleLogin />

  <div className="relative w-full my-5 flex justify-center items-center">
    <div className="w-full border-t"></div>
    <span className="absolute bg-white px-2 text-sm text-gray-500">Or</span>
  </div>
</div>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your Password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        
            <div className="mb-3">
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter Password again" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className="mt-5 text-s flex justify-center item-center gap-2">
              <p>Already have an account?</p>
              <Link className='text-blue-500 hover:underline' to={RouteSignin}> sign </Link>
            </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;

