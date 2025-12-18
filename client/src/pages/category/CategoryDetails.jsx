import React from 'react'
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
import { RouteAddCategory, RouteEditCategory } from '@/helper/RouteName'
import { useFetch } from '@/hooks/useFettch'
import { getEnv } from '@/helper/getenv'
import Loading from '@/components/Loading'
import { FaEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { showToast } from '@/helper/showToast'
import { deleteData } from '@/helper/handleDelete'


const CategoryDetails = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const{data:categoryData,loading,error}=useFetch(`${base.replace(/\/$/, "")}/category/all-category`,{
    method:'get',
    credentials:'include',

  }

  )

  const handleDelete=(id)=>{
     const base = import.meta.env.VITE_API_BASE_URL || "";
    const response =deleteData(`${base.replace(/\/$/, "")}/category/delete/${id}`)
    if(response){
      showToast('success','Data deleted')
    }else{
      showToast('error','Data not deleted')
    }
  }
  if(loading)return<Loading/>
  return (
    <div className="flex justify-center items-start pt-10 pb-6 w-full min-h-[calc(100vh-120px)]">
      <Card className="w-[950px] shadow-lg p-8 rounded-xl">
        <CardHeader>
          <div className="flex items-start justify-between w-full gap-4">
            <div>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>List of all categories in the system</CardDescription>
            </div>

            <div className="ml-auto">
              <Button asChild>
                <Link to={RouteAddCategory}>Add Category</Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>List of all categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Category </TableHead>
                <TableHead>slug</TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
         {categoryData && categoryData.category.length > 0 ? (
  categoryData.category.map(category => (
    <TableRow key={category._id}>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.slug}</TableCell>

      {/* ACTION CELL */}
     <TableCell className="flex justify-end gap-3">
  {/* EDIT */}
  <Link to={RouteEditCategory(category._id)}>
    <Button
      variant="outline"
      className="h-9 w-9 p-0 flex items-center justify-center 
                 hover:bg-blue-600 hover:text-white transition"
    >
      <FaEdit size={16} />
    </Button>
  </Link>

  {/* DELETE */}
  <Button onClick={()=>handleDelete(category._id)}
    variant="outline"
    className="h-9 w-9 p-0 flex items-center justify-center 
               hover:bg-blue-600 hover:text-white transition"
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

export default CategoryDetails
