"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Database, 
  FileSpreadsheet, 
  RefreshCw, 
  BrainCircuit, 
  Activity, 
  Settings,
  Layers
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Data Pipeline", href: "/datapipeline", icon: Layers }, // Existing route from Navbar
  { name: "Ingestion", href: "/ingestionETL", icon: Database },
  { name: "Enrichment", href: "/enrichmentETL", icon: FileSpreadsheet },
  { name: "Transformation", href: "/transformationETL", icon: RefreshCw },
  { name: "Model Training", href: "/modeltraining", icon: BrainCircuit },
  { name: "Monitoring", href: "/monitoringETL", icon: Activity },
  { name: "ETL Multiform", href: "/etlmultiform", icon: FileSpreadsheet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-[#333333] transition-transform duration-300 ease-in-out transform hidden md:translate-x-0 md:block">
      <div className="flex items-center justify-center h-16 border-b border-[#333333]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ClickML
        </h1>
      </div>
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                isActive
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-gray-400 hover:bg-[#222222] hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                  isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-[#333333]">
        <Link
          href="/settings"
          className="flex items-center px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-[#222222] hover:text-white transition-colors duration-200"
        >
          <Settings className="w-5 h-5 mr-3 text-gray-500 hover:text-white" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
