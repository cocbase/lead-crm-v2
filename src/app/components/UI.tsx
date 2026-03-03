import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Card Component
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all", className)}>
      {children}
    </div>
  );
}

// Badge Component
export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" | "info"; className?: string }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  };
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
}

// Button Component
export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  icon: Icon,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ElementType;
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:ring-blue-500/20",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-500/20",
    outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm focus:ring-slate-500/10",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus:ring-rose-500/20",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm font-medium",
    lg: "px-6 py-3 text-base font-semibold",
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg transition-all focus:outline-none focus:ring-4 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn("shrink-0", size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")} />}
      {children}
    </button>
  );
}

// StatCard Component
export function StatCard({ 
  title, 
  value, 
  trend, 
  trendUp, 
  icon: Icon, 
  iconColor = "bg-blue-100 text-blue-600" 
}: { 
  title: string; 
  value: string | number; 
  trend?: string; 
  trendUp?: boolean; 
  icon: React.ElementType;
  iconColor?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={cn("p-2.5 rounded-xl transition-colors", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={cn("text-xs font-bold", trendUp ? "text-emerald-600" : "text-rose-600")}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </Card>
  );
}
