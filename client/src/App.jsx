import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './layout/Layout'
import { RouteAddCategory, RouteBlog, RouteBlogAdd, RouteBlogDetails, RouteBlogEdit, RouteCategoryDetails, RouteEditCategory, RouteIndex, RouteProfile, RouteSignin, RouteSignup } from './helper/RouteName'
import Index from './pages/Index'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import AddCategory from './pages/category/AddCategory'
import CategoryDetails from './pages/category/CategoryDetails'
import EditCategory from './pages/category/EditCategory'
import AddBlog from './pages/blog/AddBlog'
import BlogDetails from './pages/blog/BlogDetails'
import EditBlog from './pages/blog/EditBlog'
import SingleBlogDetails from './pages/SingleBlogDetails'
import CategoryBlogsPage from './pages/CategoryBlogsPage'
import SearchResults from './pages/SearchResults'
import CommentsPage from './pages/CommentsPage'
import UsersPage from './pages/UsersPage'
import AuthRouteProtection from './components/AuthRouteProtection'
import OnlyAdminAuthRoute from './components/OnlyAdminAuthRoute'



const App = () => (
  <div>
    <BrowserRouter>
    <Routes>
      <Route path={RouteIndex} element={<Layout/>}>
      <Route index element={<Index/>}/>
      

      {/*blog category*/}
     

      {/*blog*/}
      
      <Route path={RouteBlogDetails()} element={<SingleBlogDetails/>}/>
      <Route path="/category/:categoryId" element={<CategoryBlogsPage/>}/>
      <Route path="/search" element={<SearchResults/>}/>
      
      
      <Route element={<AuthRouteProtection/>}>
      <Route path={RouteProfile} element={<Profile/>}/>
      <Route path={RouteBlogAdd} element={<AddBlog/>}/>
      <Route path={RouteBlog} element={<BlogDetails/>}/>
      <Route path={RouteBlogEdit()} element={<EditBlog/>}/>
      <Route path="/comments" element={<CommentsPage/>}/>

      </Route>
      
      <Route element={<OnlyAdminAuthRoute/>}>
       <Route path={RouteAddCategory} element={<AddCategory/>}/>
      <Route path={RouteCategoryDetails} element={<CategoryDetails/>}/>
      <Route path={RouteEditCategory()} element={<EditCategory/>}/>
      <Route path="/users" element={<UsersPage/>}/>


      </Route>
      </Route>
      <Route path={RouteSignin} element={<Signin/>}></Route>
      <Route path={RouteSignup} element={<Signup/>}></Route>

    </Routes>
    
    </BrowserRouter>

  </div>
)

export default App
