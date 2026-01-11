"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Menu, MessageCircle, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user: User = session?.user;
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="True Feedback Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Ask
              <span className="text-[#213448] dark:text-primary">Me</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "secondary" : "ghost"}
                    className="transition-all duration-200 cursor-pointer bg-primary text-background hover:text-foreground dark:text-white hover:bg-primary/20"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary dark:hover:bg-primary cursor-pointer"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="transition-all duration-200 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border/50 animate-fade-in"
          >
            <div className="flex flex-col gap-2">
              <ThemeToggle />
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="w-full justify-start border-primary/30"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start cursor-pointer"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer ">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
