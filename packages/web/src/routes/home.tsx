import type { Route } from "./+types/home";
import { useState } from "react";
import CreateRequest from "../pages/CreateRequest";
import BrowseRequests from "../pages/BrowseRequests";
import ManageRequests from "../pages/ManageRequests";
import { Mic, Search, BarChart3 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Revit - AI-Powered Feedback Platform" },
    { name: "description", content: "Get feedback on your projects with AI-powered questionnaires" },
  ];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'manage'>('create');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Elegant App Bar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-purple-200/50 sticky top-0 z-50 shadow-xl shadow-purple-100/50">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-5">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-center items-center py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-sm">R</span>
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Revit
                </h1>
                <span className="text-lg">✨</span>
              </div>
            </div>
            <div className="flex justify-center space-x-1 pb-4">
              {[
                { key: 'create', icon: Mic, label: 'Create', color: 'bg-emerald-500', description: 'New Request' },
                { key: 'browse', icon: Search, label: 'Browse', color: 'bg-blue-500', description: 'Find Projects' },
                { key: 'manage', icon: BarChart3, label: 'Manage', color: 'bg-pink-500', description: 'Your Requests' }
              ].map(({ key, icon: Icon, label, color, description }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`
                    relative group px-4 py-3 rounded-2xl font-bold transition-all duration-300 flex flex-col items-center gap-1 text-white shadow-lg text-xs
                    ${activeTab === key 
                      ? `${color} scale-110 shadow-2xl ring-4 ring-white/50` 
                      : `${color} opacity-80 hover:opacity-100 hover:scale-105`
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{label}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {description}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-lg">R</span>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Revit
                </h1>
                <p className="text-xs text-slate-500 font-medium">AI-Powered Feedback Platform</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {[
                { key: 'create', icon: Mic, label: 'Create Request', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600', description: 'Start a new feedback request' },
                { key: 'browse', icon: Search, label: 'Browse Projects', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', description: 'Find projects to give feedback on' },
                { key: 'manage', icon: BarChart3, label: 'Manage', color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600', description: 'Manage your requests' }
              ].map(({ key, icon: Icon, label, color, hoverColor, description }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`
                    relative group px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 text-white shadow-lg transform hover:scale-105 hover:-translate-y-1
                    ${activeTab === key 
                      ? `${color} scale-105 shadow-2xl ring-4 ring-white/50 -translate-y-1` 
                      : `${color} ${hoverColor} opacity-90 hover:opacity-100`
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-black">{label}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto py-4 sm:py-8 px-3 sm:px-5">
        <div className="animate-fade-in">
          {activeTab === 'create' && <CreateRequest />}
          {activeTab === 'browse' && <BrowseRequests />}
          {activeTab === 'manage' && <ManageRequests />}
        </div>
      </main>
    </div>
  );
}
