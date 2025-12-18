import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouteBlogAdd, RouteBlogEdit } from '@/helper/RouteName'
import { useFetch } from '@/hooks/useFettch'
import { getEnv } from '@/helper/getenv'
import Loading from '@/components/Loading'
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { showToast } from '@/helper/showToast'
import { deleteData } from '@/helper/handleDelete'
import moment from 'moment'

const BlogDetails = () => {
  const [refresh, setRefresh] = useState(0);
  const base = import.meta.env.VITE_API_BASE_URL || "";
    const{data:blogData,loading,error}=useFetch(`${base.replace(/\/$/, "")}/blog/get-all`,{
      method:'get',
      credentials:'include',
  
    }, [refresh]
  
    )
  
    const handleDelete=async(id)=>{
       const base = import.meta.env.VITE_API_BASE_URL || "";
      const response =await deleteData(`${base.replace(/\/$/, "")}/blog/delete/${id}`)
      if(response){
        showToast('success','Data deleted')
        setRefresh(prev => prev + 1);
      }else{
        showToast('error','Data not deleted')
      }
    }
    console.log( blogData);
    if(loading)return<Loading/>
  return (
    <div className="flex justify-center items-start pt-4 md:pt-10 pb-6 w-full min-h-[calc(100vh-120px)] px-4">
      <Card className="w-full max-w-[950px] shadow-lg p-4 md:p-8 rounded-xl">
        <CardHeader className="px-0">
          <div className="flex flex-col sm:flex-row items-start justify-between w-full gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Blog Details</CardTitle>
             
            </div>

            <div className="w-full sm:w-auto">
              <Button asChild className="w-full sm:w-auto">
                <Link to={RouteBlogAdd}>Add blog</Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 overflow-x-auto">
          <Table>
            <TableCaption>List of all Blogs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Author</TableHead>
                <TableHead className="min-w-[120px]">blog</TableHead>
                <TableHead className="min-w-[150px]">Title</TableHead>
                <TableHead className="min-w-[100px]">slug</TableHead>
                <TableHead className="min-w-[100px]">Dated</TableHead>
                <TableHead className="min-w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              
                

                {blogData && blogData.blogs.length > 0 ? (
                  blogData.blogs.map(blog => (
                    <TableRow key={blog._id}>
                      
                      <TableCell>{blog?.author?.name}</TableCell>
                      <TableCell>{blog?.category?.name}</TableCell>
                      <TableCell>{blog?.title}</TableCell>
                      <TableCell>{blog?.slug}</TableCell>
                      <TableCell>{moment(blog?.createdAt).format('YYYY-MM-DD')}</TableCell>
                     

                      <TableCell className="flex justify-end gap-3">
                        <Link to={RouteBlogEdit(blog._id)}>
                          <Button variant="outline" className="h-9 w-9 p-0 flex items-center justify-center">
                            <FaEdit size={16} />
                          </Button>
                        </Link>

                        <Button
                          onClick={() => handleDelete(blog._id)}
                          variant="outline"
                          className="h-9 w-9 p-0 flex items-center justify-center"
                        >
                          <GoTrash size={16} />
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Data not found
                    </TableCell>
                  </TableRow>
                )}

             

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogDetails
