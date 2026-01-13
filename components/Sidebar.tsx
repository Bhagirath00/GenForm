"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { ChartSpline, ClipboardList } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

type MenuItems = {
  title: string;
  url: string;
  icon: React.ReactNode;
};

const items: MenuItems[] = [
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <ChartSpline />,
  },
  {
    title: "My Forms",
    url: "/dashboard/forms",
    icon: <ClipboardList />,
  },
];

const DashboardSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile - fixed at top */}
      <button
        className="md:hidden fixed top-0 left-0 z-50 p-4 bg-white shadow-md"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 flex">
          <div className="bg-white text-black w-64 h-full shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FaTimes size={24} />
            </button>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center justify-between">
                  <Link href={"/"} className="font-bold text-lg">
                    GenForm.ai
                  </Link>
                </SidebarGroupLabel>
                <Separator className="my-2" />
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} onClick={() => setSidebarOpen(false)}>
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar always visible on desktop */}
      <div className="hidden md:block">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between">
                <Link href={"/"} className="font-bold text-lg">
                  GenForm.ai
                </Link>
              </SidebarGroupLabel>
              <Separator className="my-2" />
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  );
};

export default DashboardSidebar;