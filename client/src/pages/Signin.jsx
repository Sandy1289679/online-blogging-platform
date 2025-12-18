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
import { Link, useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignup } from "@/helper/RouteName";
import { showToast } from "@/helper/showToast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import GoogleLogin from "@/components/GoogleLogin";


const Signin = () => {
const dispatch = useDispatch()


  const navigate=useNavigate()
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3, "password field required "),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 async function onSubmit(values) {
  try {
    const base = import.meta.env.VITE_API_BASE_URL;
    const url = `${base.replace(/\/$/, "")}/auth/login`;

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showToast("error", data?.message || "Login failed");
      return;
    }
    dispatch(setUser(data.user))

    showToast("success", data?.message || "Login successful");
    navigate(RouteIndex, { replace: true });

  } catch (err) {
    showToast("error", "Network error — server may be down");
    console.error(err);
  }
}


  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5">
          Login Into Account
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
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Password" {...field} />
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
              <p>Don't have an account?</p>
              <Link className='text-blue-500 hover:underline' to={RouteSignup}> sign up</Link>
            </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
