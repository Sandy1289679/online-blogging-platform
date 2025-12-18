import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/helper/getenv';
import { useFetch } from '@/hooks/useFettch';
import React from 'react'

const Index = () => {
  
    const base = import.meta.env.VITE_API_BASE_URL || "";
      const{data:blogData,loading,error}=useFetch(`${base.replace(/\/$/, "")}/blog/public/all`,{
        method:'get',
        credentials:'include',

      } )
      if(loading)return<Loading/>
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-8 md:px-16 lg:px-33">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-stretch">
        {blogData && blogData.blogs.length > 0 ? (
          blogData.blogs.map(blog => <BlogCard key={blog._id} props={blog} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">Data not found</div>
        )}
      </div>
    </div>
  );
}

export default Index
