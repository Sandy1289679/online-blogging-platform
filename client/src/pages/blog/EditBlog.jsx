import React, { use, useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import slugify from 'slugify';
import { showToast } from '@/helper/showToast';
import { getEnv } from '@/helper/getenv';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFettch';
import Dropzone from 'react-dropzone';
import Editor from '@/components/Editor';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteBlog } from '@/helper/RouteName';
import { decode } from 'entities';




const EditBlog = () => {
  const{blogid}=useParams()
  const navigate=useNavigate()
  const user=useSelector((state)=>state.user)
  const base = import.meta.env.VITE_API_BASE_URL || "";
    const{data:categoryData}=useFetch(`${base.replace(/\/$/, "")}/category/all-category`,{
      method:'get',
      credentials:'include',
  
    }
  
    )
    const{data:blogData}=useFetch(`${base.replace(/\/$/, "")}/blog/edit/${blogid}`,{
      method:'get',
      credentials:'include',
    },[blogid]
  
    )
      const [filePreview,setPreview]=useState()
      const[file,setFile]=useState()
  
  const formSchema = z.object({
    category: z.string().min(3, "category must be at least 3 characters long"),
    title: z.string().min(3, "title must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    blogcontent: z.string().min(3, "blog content must be at least 3 characters long"),
   
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title:"",
      slug: "",
      blogcontent:'',
    },
  });
  useEffect(()=>{
    if(blogData && blogData.success){
      form.setValue('category',blogData.blog.category._id)
      form.setValue('title',blogData.blog.title)
      form.setValue('slug',blogData.blog.slug)
      form.setValue('blogcontent', decode(blogData.blog.blogcontent || ''))
      setPreview(blogData.blog.featuredImage)
    }

      },[blogData])

  const handleEditorData=(event,editor)=>{
    const data=editor.getData()
   form.setValue('blogcontent',data)
  }
// watch only the name field
const nameValue = useWatch({
  control: form.control,
  name: "title",
});

// update slug only when name changes and slug actually differs
useEffect(() => {
  const newSlug = nameValue ? slugify(nameValue, { lower: true }) : "";
  if (form.getValues("slug") !== newSlug) {
    form.setValue("slug", newSlug, { shouldValidate: false, shouldDirty: true });
  }
}, [nameValue, form]);

async function onSubmit(values) {
  
  try {
    if (!user || !user.user) {
      showToast('error', 'You must be logged in to edit a blog');
      return;
    }
    const newValues={...values,author:user.user._id}
    console.log('newValues:', newValues);
      const formData=new FormData()
      if (file) {
        formData.append('file',file)
      }
      formData.append('data',JSON.stringify(newValues))
      const base = import.meta.env.VITE_API_BASE_URL;
      const url = `${base.replace(/\/$/, "")}/blog/update/${blogid}`;
      console.log('url:', url);

      const res = await fetch(url, {
        method: "put",
        credentials: "include",
        body: formData,
      });
      console.log('response status:', res.status);

      const data = await res.json().catch(() => ({}));
      console.log('response data:', data);

      if (!res.ok) {
        showToast("error", data.message );
        return;
      }
      form.reset()
      setFile()
      setPreview()
       navigate(RouteBlog)
      showToast("success", data.message);
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

  return (
    <div className="flex justify-center items-start pt-10 pb-6 w-full min-h-[calc(100vh-120px)]">
      <Card className="w-[1050px] shadow-lg p-8 rounded-xl text-2xl">
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                  
                    <FormLabel>category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}
                      value={field.value}>
  <SelectTrigger >
    <SelectValue placeholder="Select Category" />
  </SelectTrigger>
  <SelectContent>
  {categoryData && categoryData.category.length>0 && categoryData.category.map(category=>
  <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
  )}
    
    
  </SelectContent>
</Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <div className='mb-3'>
             <span className='mb-2 block'>Featured Image</span>
                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                 {({getRootProps, getInputProps}) => (
                  
                     <div {...getRootProps()}>
                       <input {...getInputProps()} />
                       <div className='flex justify-center items-center w-36 h-28 border-2 border-dashed rounded'>
                        <img src={filePreview} className="w-full h-full object-cover rounded"/>
                       </div>
                       
                       </div>
                 )}
                       
                    
               </Dropzone>
               </div>
               <div className='mb-3'>
                 <FormField
                control={form.control}
                name="blogcontent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog  Content</FormLabel>
                    <FormControl>
                      <Editor key={field.value} props={{initialData:decode(field.value || ''), onChange:handleEditorData}}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               </div>
              

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlog;