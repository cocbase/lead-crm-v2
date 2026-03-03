import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileDown, 
  Calendar,
  Filter,
  MoreVertical,
  ChevronRight,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import { Card, StatCard, Badge, Button } from "../components/UI";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { motion } from "motion/react";

const conversionData = [
  { name: "Jan", leads: 400, enroled: 80 },
  { name: "Feb", leads: 300, enroled: 65 },
  { name: "Mar", leads: 200, enroled: 45 },
  { name: "Apr", leads: 278, enroled: 60 },
  { name: "May", leads: 189, enroled: 40 },
  { name: "Jun", leads: 239, enroled: 55 },
  { name: "Jul", leads: 349, enroled: 70 },
];

const sourceData = [
  { name: "Facebook Ads", value: 35, color: "#3b82f6" },
  { name: "Google Search", value: 25, color: "#10b981" },
  { name: "Instagram", value: 20, color: "#f59e0b" },
  { name: "LinkedIn", value: 15, color: "#8b5cf6" },
  { name: "Direct/Referral", value: 5, color: "#64748b" },
];

const performanceStats = [
  { name: "Sarah Jenkins", leads: 124, conversions: 28, rate: 22.5, status: "top" },
  { name: "Mike Ross", leads: 98, conversions: 18, rate: 18.3, status: "steady" },
  { name: "John Doe", leads: 86, conversions: 14, rate: 16.2, status: "needs_work" },
  { name: "Emily Blunt", leads: 112, conversions: 24, rate: 21.4, status: "steady" },
];

export function Reports() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 mt-1">
            Insightful data to help you improve student conversions.{" "}
            <Badge variant="warning" className="text-[10px] px-2 py-0.5 ml-2">Includes Demo Analytics</Badge>
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue Potential</p>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">$2.4M</h3>
            <span className="text-xs font-bold text-emerald-600">+12%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-1">ESTIMATED FROM PIPELINE</p>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment Goal</p>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><PieChartIcon className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">68%</h3>
            <span className="text-xs font-bold text-slate-400">Target: 80%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="w-[68%] h-full bg-emerald-500 rounded-full"></div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-600">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Conversion Time</p>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Activity className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">12 Days</h3>
            <span className="text-xs font-bold text-rose-500">+2d</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-1">SLOWER THAN LAST MONTH</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-rose-600">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lost Leads (Churn)</p>
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600"><ArrowDownRight className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">4.2%</h3>
            <span className="text-xs font-bold text-emerald-600">-0.5%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-1">LOWEST IN 6 MONTHS</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Acquisition Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly leads vs actual enrollments</p>
            </div>
            <select className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none">
              <option>By Month</option>
              <option>By Week</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
                <Area type="monotone" dataKey="enroled" stroke="#10b981" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Source Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Lead Sources</h3>
              <p className="text-xs text-slate-500 mt-0.5">Where your leads are coming from</p>
            </div>
            <Button variant="outline" size="sm" icon={MoreVertical} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center h-72">
            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {sourceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Counselor Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Counselor Conversion Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Detailed breakdown of team performance</p>
          </div>
          <Button variant="primary" size="sm" icon={FileDown} className="font-bold">Full Performance Report</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-4 py-4">Counselor Name</th>
                <th className="px-4 py-4 text-center">Total Leads</th>
                <th className="px-4 py-4 text-center">Conversions</th>
                <th className="px-4 py-4 text-center">Conversion %</th>
                <th className="px-4 py-4 text-center">Trend</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performanceStats.map((stat) => (
                <tr key={stat.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                        {stat.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{stat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700">{stat.leads}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700">{stat.conversions}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{stat.rate}%</span>
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stat.rate * 3}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {stat.status === 'top' ? (
                      <Badge variant="success" className="text-[10px] font-bold"><ArrowUpRight className="w-3 h-3 mr-1" /> EXCELLENT</Badge>
                    ) : stat.status === 'steady' ? (
                      <Badge variant="info" className="text-[10px] font-bold">STEADY</Badge>
                    ) : (
                      <Badge variant="error" className="text-[10px] font-bold"><ArrowDownRight className="w-3 h-3 mr-1" /> AT RISK</Badge>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" icon={ChevronRight} className="p-1 h-8 w-8 text-slate-400 hover:text-blue-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
