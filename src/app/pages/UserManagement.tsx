import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Shield, 
  UserPlus, 
  Lock, 
  Settings, 
  LogOut, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  GraduationCap
} from "lucide-react";
import { Card, Button, Badge } from "../components/UI";
import { motion } from "motion/react";

const usersData = [
  { id: 1, name: "Sarah Jenkins", role: "Admin", email: "sarah.j@leadcrm.edu", status: "Active", lastActive: "Just now", permissions: "Full Access" },
  { id: 2, name: "Mike Ross", role: "Counselor", email: "mike.r@leadcrm.edu", status: "Active", lastActive: "2 hours ago", permissions: "Leads, Pipeline" },
  { id: 3, name: "John Doe", role: "Counselor", email: "john.d@leadcrm.edu", status: "Inactive", lastActive: "3 days ago", permissions: "Leads" },
  { id: 4, name: "Emily Blunt", role: "Manager", email: "emily.b@leadcrm.edu", status: "Active", lastActive: "1 day ago", permissions: "Leads, Reports, Pipeline" },
  { id: 5, name: "Robert Downey", role: "Counselor", email: "robert.d@leadcrm.edu", status: "Away", lastActive: "10 mins ago", permissions: "Leads" },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">
            View team members and their permissions.{" "}
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 ml-2">Demo Data Only</Badge>
          </p>
        </div>
      </div>

      {/* Permission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-blue-50/50 border-blue-100 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20"><Shield className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Total Admins</h3>
            <span className="text-xl font-extrabold text-blue-700">2 Users</span>
          </div>
        </Card>
        <Card className="p-4 bg-emerald-50/50 border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20"><GraduationCap className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Total Counselors</h3>
            <span className="text-xl font-extrabold text-emerald-700">12 Users</span>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/50 border-amber-100 flex items-center gap-4">
          <div className="p-3 bg-amber-600 rounded-xl text-white shadow-md shadow-amber-500/20"><Clock className="w-5 h-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Pending Invites</h3>
            <span className="text-xl font-extrabold text-amber-700">3 Sent</span>
          </div>
        </Card>
      </div>

      <Card className="p-0 border-slate-200">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative max-w-sm w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Find users by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Filter} className="bg-white font-semibold">Filter Roles</Button>
            <Button variant="outline" size="sm" icon={Settings} className="bg-white font-semibold">Permissions Setup</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role & Permissions</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-4 py-4 font-bold">Last Activity</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 border border-slate-200 shadow-sm overflow-hidden">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block leading-tight">{user.name}</span>
                        <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <Badge variant={user.role === 'Admin' ? 'info' : 'default'} className="w-fit text-[10px] font-bold uppercase tracking-widest">{user.role}</Badge>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">Access to: <span className="text-slate-600">{user.permissions}</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        user.status === 'Active' ? 'bg-emerald-500' : 
                        user.status === 'Away' ? 'bg-amber-500' : 'bg-slate-300'
                      )}></div>
                      <span className="text-sm font-bold text-slate-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 opacity-50" />
                      <span className="text-xs font-semibold">{user.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Permissions">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Lock User">
                        <Lock className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove User">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 rounded-b-xl">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total Users: 14</span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Page 1 of 1</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
