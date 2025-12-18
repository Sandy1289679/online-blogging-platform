import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/Topbar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Topbar */}
      <Topbar />
      
      <AppSidebar />
      
      <main className="w-full pt-16 pb-10 bg-background text-foreground peer-data-[state=collapsed]:ml-0 md:peer-data-[state=expanded]:ml-[var(--sidebar-width)]">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;