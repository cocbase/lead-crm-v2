import React, { useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Trello, 
  CalendarClock, 
  BarChart3, 
  UserCog, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { NotificationDropdown } from "../components/NotificationDropdown";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DashboardLayout() {
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Pipeline", icon: Trello, path: "/pipeline" },
    { name: "Follow-Ups", icon: CalendarClock, path: "/follow-ups" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    ...(user?.role === 'Admin' ? [
      { name: "Users", icon: UserCog, path: "/users" },
    ] : []),
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">LeadCRM</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-600 shadow-xs" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
              {item.name}
              {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function Header() {
  const { user } = useApp();
  const userName = user?.name || "User";
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Search disabled - navigate to Leads page to search */}
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-900 leading-none">{userName}</div>
            <div className="text-xs text-slate-500 mt-1">{user?.role || "Counselor"}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
