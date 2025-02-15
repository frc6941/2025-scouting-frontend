"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ChartNoAxesGantt, Binoculars, BookUser, Home, Settings, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";

import { getCookie, hasCookie } from "cookies-next/client";


//sub in with the ironpulse logo
const Logo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36" className="text-primary">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export type JwtPayload = {
  name: string;
  sub: string;
  avatarUrl: string;
  roles: Role[];
};

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isLoggedIn = hasCookie("Authorization")

  const menuItems = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Pit Scouting", href: "/pit-scouting", icon: <BookUser className="w-5 h-5" /> },
    { name: "Scouting", href: "/scouting/step1", icon: <Binoculars className="w-5 h-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  function setUserInfo(payload: JwtPayload) {
    throw new Error("Function not implemented.");
  }
  

  // useEffect(() => {
  //   if (!isLoggedIn && window.location.pathname !== '/auth/feishu') {
  //     window.location.assign("https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_a71a0cebd21a900d&redirect_uri=http://localhost:3000/auth/feishu");
  //   }
  //   if (isLoggedIn && window.location.pathname !== '/auth/feishu') {
  //     const token = getCookie("Authorization");
  //     const payload = jwtDecode<JwtPayload>(token!);
  //     setUserInfo(payload);
  //   }
  // }, [isLoggedIn]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
      border-b border-gray-200 dark:border-zinc-800 
      bg-white/90 dark:bg-zinc-900/90 
      backdrop-blur-lg h-16">
      <div className="px-4 h-full mx-auto flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-lg
            text-gray-700 hover:bg-gray-100
            dark:text-zinc-100 dark:hover:bg-zinc-800/70"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo - Mobile */}
        <div className="flex items-center gap-2 sm:hidden">
          <Logo />
          <span className="font-bold text-gray-900 dark:text-zinc-100">IronPulse</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-gray-900 dark:text-zinc-100">IronPulse</span>
          </Link>

          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  transition-all duration-200
                  ${pathname === item.href 
                    ? 'text-gray-900 dark:text-zinc-100 font-semibold bg-gray-100 dark:bg-zinc-800' 
                    : 'text-gray-600 dark:text-zinc-400 font-normal hover:text-gray-900 hover:bg-gray-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/70'}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Theme Switcher and Avatar */}
        <div className="flex justify-end gap-4">
          <div className="sm:flex hidden items-center">
            <ThemeSwitcher />
          </div>

          <div className="flex items-center">
            <Image src="/example.jpg" alt="IronPulse" width={45} height={45} className="rounded-full" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden fixed inset-x-0 top-16 
            bg-white/95 dark:bg-zinc-900/95 
            backdrop-blur-lg 
            border-b border-gray-200 dark:border-zinc-800">
            <div className="px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${pathname === item.href 
                      ? 'text-gray-900 dark:text-zinc-100 font-semibold bg-gray-100 dark:bg-zinc-800' 
                      : 'text-gray-600 dark:text-zinc-400 font-normal hover:text-gray-900 hover:bg-gray-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/70'}
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 

