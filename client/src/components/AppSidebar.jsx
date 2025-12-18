import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import logo from "@/assets/images/logo-white.png";
import { FaHome } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaBlogger } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { GoDot } from "react-icons/go";
import { RouteBlog, RouteCategoryDetails, RouteIndex } from "@/helper/RouteName";
import { useFetch } from "@/hooks/useFettch";
import { getEnv } from "@/helper/getenv";
import { useSelector } from "react-redux";



export function AppSidebar() {
  const user=useSelector((state)=>state.user)
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const{data:categoryData}=useFetch(`${base.replace(/\/$/, "")}/category/all-category`,{
      method:'get',
      credentials:'include',
  
    }
  
    )
  
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent className="bg-white px-2 py-3 mt-16">
          <SidebarGroup>
            {/* Home - visible to all */}
            <SidebarMenuItem>
              <Link to={RouteIndex} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-slate-50">
                <FaHome />
                <span>Home</span>
              </Link>
            </SidebarMenuItem>

            {/* Categories - admin only */}
            {user && user.isLoggedIn && user.user && user.user.role === 'admin' && (
              <SidebarMenuItem>
                <Link to={RouteCategoryDetails} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-slate-50">
                  <BiSolidCategoryAlt />
                  <span>Categories</span>
                </Link>
              </SidebarMenuItem>
            )}

            {/* Blogs - logged in users only */}
            {user && user.isLoggedIn && (
              <SidebarMenuItem>
                <Link to={RouteBlog} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-slate-50">
                  <FaBlogger />
                  <span>Blogs</span>
                </Link>
              </SidebarMenuItem>
            )}

            {/* Comments - logged in users only */}
            {user && user.isLoggedIn && (
              <SidebarMenuItem>
                <Link to="/comments" className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-slate-50">
                  <FaComment />
                  <span>Comments</span>
                </Link>
              </SidebarMenuItem>
            )}

            {/* Users - admin only */}
            {user && user.isLoggedIn && user.user && user.user.role === 'admin' && (
              <SidebarMenuItem>
                <Link to="/users" className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-slate-50">
                  <HiUsers />
                  <span>Users</span>
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarGroup>

          {/* Categories List - visible to all */}
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            {categoryData && categoryData.category.length > 0 && categoryData.category.map(category => 
              <SidebarMenuItem key={category._id}>
                <Link to={`/category/${category._id}`} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-slate-50">
                  {category.name}
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  );
}
