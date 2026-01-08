"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
         {/* Top Header for Mobile Menu or User Profile could go here */}
         <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-[#111111]/80 backdrop-blur-md border-b border-[#333333] md:hidden">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ClickML</span>
            {/* Mobile menu trigger would go here */}
         </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
