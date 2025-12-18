import { RouteIndex, RouteSignin } from '@/helper/RouteName'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const OnlyAdminAuthRoute = () => {
  
    const user = useSelector((state) => state.user)
    
    if (user && user.isLoggedIn && user.user && user.user.role === 'admin') {
      return <Outlet/>
    } else if (user && user.isLoggedIn) {
      // User is logged in but not admin
      return <Navigate to={RouteIndex}/>
    } else {
      // User is not logged in
      return <Navigate to={RouteSignin}/>
    }
  
}

export default OnlyAdminAuthRoute
