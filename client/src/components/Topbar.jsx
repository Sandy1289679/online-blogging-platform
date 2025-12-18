import React from "react";
import logo from "@/assets/images/logo-white.png";

import { FaSignInAlt, FaUser, FaPlus } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";

import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import { RouteIndex, RouteProfile, RouteSignin, RouteBlogAdd } from "@/helper/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useicon from "@/assets/images/user.png";
import { removeUser } from "@/redux/user/user.slice";
import { showToast } from "@/helper/showToast";

const Topbar = () => {
  const navigate = useNavigate(); // <<-- call the hook
  const dispatch = useDispatch();
  const { toggleSidebar } = useSidebar();
  // Defensive default so component never crashes if state.user is undefined
  const user = useSelector((state) => state.user ?? { isLoggedIn: false, user: {} });

  const handleLogout = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL;
      const url = `${base.replace(/\/$/, "")}/auth/logout`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast("error", data?.message || "Logout failed");
        return;
      }

      dispatch(removeUser());
      showToast("success", data?.message || "Logout successful");
      navigate(RouteIndex);
    } catch (err) {
      console.error(err);
      showToast("error", "Network error — server may be down");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white border-b flex items-center px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <HiMenu className="h-6 w-6" />
        </Button>
        <img src={logo} alt="GBlog" className="h-8" />
      </div>

      <div className="flex-1 flex justify-center px-2 mx-4">
        <div className="w-full max-w-3xl">
          <SearchBox />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {!user.isLoggedIn ? (
          <Button asChild className="rounded-full" size="sm">
            <Link to={RouteSignin}>
              <FaSignInAlt />
              <span className="ml-2 hidden sm:inline">Sign in</span>
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.user?.avatar || useicon} alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p>{user?.user?.name || "User"}</p>
                <p className="text-sm">{user?.user?.email || ""}</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to={RouteProfile} className="flex items-center gap-2">
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={RouteBlogAdd} className="flex items-center gap-2">
                  <FaPlus />
                  <span>Add Blog</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                <LuLogOut />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Topbar;
