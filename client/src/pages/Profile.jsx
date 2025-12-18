// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoCameraOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import useicon from "@/assets/images/user.png";
import { setUser } from "@/redux/user/user.slice"; // adjust if action name differs
import { showToast } from "@/helper/showToast";
import { Textarea } from "@/components/ui/textarea"
import { getEnv } from "@/helper/getenv";
import { useFetch } from "@/hooks/useFettch";
import Loading from "@/components/Loading";
import Dropzone from "react-dropzone";


const Profile = () => {
  const [filePreview,setPreview]=useState()
  const[file,setFile]=useState()
  const user=useSelector((state)=>state.user)
  const userId = user?.user?._id;
  const{data:userData,loading,error}=useFetch(
    userId ? `${getEnv('VITE_API_BASE_URL')}/user/get-user/${userId}` : null,
    {method:'get',credentials:'include'}
  )
  
  const dispatch = useDispatch();

  const formSchema = z.object({
    name:z.string().min(3, 'name must be atleast 3 charscter long'),
    email: z.string().email(),
    bio:z.string().min(3, 'name must be atleast 3 charscter long'),
    password: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name:'',email: "",bio:'', password: "" },
  });

  useEffect(()=>{
    if(userData && userData.success){
      form.reset({
        name:userData.user.name,
        email:userData.user.email,
        bio:userData.user.bio,
      })



    }
  },[userData])
 

  async function onSubmit(values) {
    try {
      if (!user?.user?._id) {
        showToast("error", "Please login first");
        return;
      }
      
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('data', JSON.stringify(values));
      
      const base = getEnv('VITE_API_BASE_URL');
      const url = `${base.replace(/\/$/, "")}/user/update-user/${user.user._id}`;
      
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        showToast("error", data.message || "Update failed");
        return;
      }
      
      // Update Redux with just the user data (not wrapped)
      dispatch(setUser(data.user));
      
      // Update form with new data
      form.reset({
        name: data.user.name,
        email: data.user.email,
        bio: data.user.bio,
      });
      
      setFile(null);
      setPreview(null);
      showToast("success", data.message || "Profile updated successfully");
    } catch (err) {
      console.error(err);
      showToast("error", "Network error — server may be down");
    }
  }

  const handleFileSelection=(files)=>{
    const file=files[0]
    const preview=URL.createObjectURL(file)
    setFile(file)
    setPreview(preview)
   
  }
   if(loading) return <Loading/>

return (
  <div className="flex justify-center items-start pt-10 pb-6 w-full min-h-[calc(100vh-120px)]">
    <Card className="w-[650px] shadow-lg p-8 rounded-xl">
   
      
      <div className="flex justify-center mb-6">

      <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
  {({getRootProps, getInputProps}) => (
   
      <div {...getRootProps()}>
        <input {...getInputProps()} />
         <Avatar className="w-24 h-24">
          <AvatarImage src={filePreview? filePreview:userData?.user?.avatar} />
          <div className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-black bg-opacity-10 border-2 border-blue-500 rounded-full cursor-pointer">
            <IoCameraOutline color="#7c3aed" />
          </div>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        </div>
  )}
        
     
</Dropzone>
        
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
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
                  <Input placeholder="Enter your Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter bio " {...field} />
                </FormControl>
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
                  <Input placeholder="Enter your password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Changes
          </Button>

        </form>
      </Form>

    </Card>
  </div>
);


};

export default Profile;
