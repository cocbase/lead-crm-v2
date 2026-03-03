import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  PhoneCall, 
  CalendarClock, 
  TrendingUp, 
  UserCheck,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router";
import { Card, StatCard, Badge, Button } from "../components/UI";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

const performanceData = [
  { name: "Mon", calls: 45, conversions: 5 },
  { name: "Tue", calls: 52, conversions: 8 },
  { name: "Wed", calls: 48, conversions: 6 },
  { name: "Thu", calls: 61, conversions: 12 },
  { name: "Fri", calls: 55, conversions: 9 },
  { name: "Sat", calls: 32, conversions: 4 },
  { name: "Sun", calls: 20, conversions: 2 },
];

export function Dashboard() {
  const { leads, activities, followUps, counselors, lastUpdated } = useApp();
  const [timeAgo, setTimeAgo] = useState("");

  // Update time ago every 10 seconds
  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Memoize expensive calculations
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
    const enrolledLeads = leads.filter(l => l.status === 'Enrolled').length;
    const conversionRate = totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0;
    
    return { totalLeads, newLeads, contactedLeads, enrolledLeads, conversionRate };
  }, [leads]);

  // Get today's follow-ups
  const todayFollowUps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return followUps.filter(f => {
      const dueDate = new Date(f.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime() && !f.completed;
    }).slice(0, 5);
  }, [followUps]);

  // Calculate counselor performance
  const counselorStats = useMemo(() => {
    return counselors.map(counselor => {
      const counselorLeads = leads.filter(l => l.assignedTo === counselor.id);
      const counselorEnrolled = counselorLeads.filter(l => l.status === 'Enrolled').length;
      const rate = counselorLeads.length > 0 ? Math.round((counselorEnrolled / counselorLeads.length) * 100) : 0;
      return {
        name: counselor.name,
        rate,
        color: counselor.id === '2' ? '#2563eb' : '#10b981'
      };
    });
  }, [leads, counselors]);

  // Recent activities
  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Counselor Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Updated {timeAgo}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard 
            title="Total Leads" 
            value={stats.totalLeads.toString()} 
            icon={Users} 
            iconColor="bg-blue-100 text-blue-600 shadow-xs" 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard 
            title="New Leads" 
            value={stats.newLeads.toString()} 
            icon={PhoneCall} 
            iconColor="bg-emerald-100 text-emerald-600 shadow-xs" 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard 
            title="Follow-Ups Today" 
            value={todayFollowUps.length.toString()} 
            icon={CalendarClock} 
            iconColor="bg-rose-100 text-rose-600 shadow-xs" 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard 
            title="Conversion Rate" 
            value={`${stats.conversionRate}%`} 
            icon={TrendingUp} 
            iconColor="bg-amber-100 text-amber-600 shadow-xs" 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <Card className="lg:col-span-2 flex flex-col p-6 h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Lead Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5">Demo Analytics Data</Badge>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-semibold text-slate-600">Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-600">Conversions</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full" style={{ minHeight: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Today's Follow-ups */}
        <Card className="flex flex-col p-0">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-slate-900">Today's Follow-Ups</h3>
            <Badge variant="warning">{todayFollowUps.length} Pending</Badge>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-1">
            {todayFollowUps.length > 0 ? todayFollowUps.map((item) => {
              const lead = leads.find(l => l.id === item.leadId);
              const time = new Date(item.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              return (
                <Link to={`/leads/${item.leadId}`} key={item.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group block">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.leadName}</span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">{lead?.course || 'N/A'}</span>
                    <Badge variant={getStatusColor(item.type)} className="text-[10px] uppercase tracking-wider px-1.5">{item.type}</Badge>
                  </div>
                </Link>
              );
            }) : (
              <div className="p-8 text-center text-slate-400 text-sm font-medium">
                No follow-ups for today.
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 shrink-0">
            <Link to="/follow-ups" className="w-full">
              <Button variant="ghost" className="w-full text-xs font-bold text-blue-600 py-1.5" icon={ChevronRight}>
                View All Follow-Ups
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Counselor Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Counselor Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Conversion rates by counselor</p>
            </div>
          </div>
          <div className="space-y-6">
            {counselorStats.map((counselor) => (
              <div key={counselor.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                      {counselor.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{counselor.name}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{counselor.rate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${counselor.rate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full shadow-xs"
                    style={{ backgroundColor: counselor.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Recent Activity</h3>
            <Badge variant="success">Live</Badge>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const lead = leads.find(l => l.id === activity.leadId);
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-xl">
                  <div className={`p-2 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {lead?.name} - {activity.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">{formatTime(activity.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getStatusColor(type: string): "primary" | "success" | "warning" | "danger" | "secondary" {
  switch (type) {
    case 'call': return 'primary';
    case 'meeting': return 'success';
    case 'email': return 'secondary';
    default: return 'warning';
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'call': return 'bg-blue-100';
    case 'email': return 'bg-purple-100';
    case 'note': return 'bg-amber-100';
    case 'status_change': return 'bg-emerald-100';
    default: return 'bg-slate-100';
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall className="w-4 h-4 text-blue-600" />;
    case 'email': return <UserCheck className="w-4 h-4 text-purple-600" />;
    case 'note': return <ChevronRight className="w-4 h-4 text-amber-600" />;
    case 'status_change': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    default: return <Users className="w-4 h-4 text-slate-600" />;
  }
}

function formatTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
