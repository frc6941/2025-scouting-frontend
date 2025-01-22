'use client'

import { useState } from "react";
import {ChartNoAxesGantt, Binoculars, BookUser} from "lucide-react"
import Link from "next/link";

const Logo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Overview", icon: <ChartNoAxesGantt /> },
    { name: "Pit Scouting", icon: <BookUser /> },
    { name: "Scouting", icon: <Binoculars />, href:"/scouting/step1" },
  ];

  return (
    <div className="relative suppressHydrationWarning">
      {/* Toggle button for both large and small screens */}
      <button
        className="dark fixed top-4 left-4 z-50 p-2 rounded-md  focus:outline-none focus:ring-2 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out border-r bg-white border-gray-200 dark:bg-black suppressHydrationWarning
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo section */}
        <div className="flex items-center gap-2 pl-[68px] py-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-semibold" >6941 IronPulse</Link>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={`flex items-center p-3 text-base rounded-lg hover:bg-gray-100 group  `}
                >
                  <span className="w-6 h-6 flex items-center justify-center text-lg">
                    {item.icon}
                  </span>
                  <span className="ml-3 font-semibold">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for large and small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
