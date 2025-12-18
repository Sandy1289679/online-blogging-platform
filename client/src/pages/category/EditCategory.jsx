import React, { useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFettch';


const EditCategory = () => {
  const {category_id}=useParams()
    const base = import.meta.env.VITE_API_BASE_URL || "";
  const {
    data:categoryData,loading,error}=useFetch(`${base.replace(/\/$/, "")}/category/show/${category_id}`,{
        method:'get',
        credentials:'include',
    
      },[category_id]
    
      )
     
  
 
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
// watch only the name field
const nameValue = useWatch({
  control: form.control,
  name: "name",
});

// update slug only when name changes and slug actually differs
useEffect(() => {
  const newSlug = nameValue ? slugify(nameValue, { lower: true }) : "";
  if (form.getValues("slug") !== newSlug) {
    form.setValue("slug", newSlug, { shouldValidate: false, shouldDirty: true });
  }
}, [nameValue, form]);

useEffect(()=>{
  if(categoryData){
    form.setValue('name',categoryData.category.name)
    form.setValue('name',categoryData.category.slug)
  }

},[categoryData])

async function onSubmit(values) {
  try {
    const base = import.meta.env.VITE_API_BASE_URL || "";
    // fix the route typo here: use 'add' (not 'ad')
    const url = `${base.replace(/\/$/, "")}/category/update/${category_id}`;

    const response = await fetch(url, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    // Check content-type to decide how to parse
    const contentType = response.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // not JSON (likely HTML error). capture text for debugging.
      const text = await response.text();
      console.error("Non-JSON response from server:", text);
      showToast("error", `Server returned non-JSON response (see console).`);
      return;
    }

    if (!response.ok) {
      showToast("error", data?.message || `Request failed ${response.status}`);
      return;
    }

    showToast("success", data?.message || "Edited successfully");
  } catch (error) {
    console.error("onSubmit error:", error);
    showToast("error", error?.message || "Network error — server may be down");
  }
}

  return (
    <div className="flex justify-center items-start pt-10 pb-6 w-full min-h-[calc(100vh-120px)]">
      <Card className="w-[950px] shadow-lg p-8 rounded-xl">
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
          <CardDescription>update the details below</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
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

export default EditCategory;