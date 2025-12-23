import { DarkMode } from "@/components/DarkMode";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  return (
    <div>
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        {/* Navbar  */}
        <nav className="flex items-center justify-between max-w-7xl mx-auto py-2 px-4">
          <Logo />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href={"/dashboard/analytics"}>
                  <Button variant={"link"}>Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link href={"/sign-in"}>
                  <Button variant={"ghost"}>Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            <DarkMode />
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <DarkMode />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigation menu
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {user ? (
                    <>
                      <Link href={"/dashboard/analytics"}>
                        <Button variant={"ghost"} className="w-full justify-start">Dashboard</Button>
                      </Link>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm font-medium">Account</span>
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href={"/sign-in"}>
                        <Button variant={"ghost"} className="w-full justify-start">Sign In</Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default layout;
