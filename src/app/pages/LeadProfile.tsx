import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { 
  ChevronLeft, 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Clock, 
  BookOpen, 
  Edit3, 
  History, 
  CheckCircle2,
  Plus,
  ArrowRight,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { Card, Button, Badge } from "../components/UI";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function LeadProfile() {
  const { id } = useParams();
  const { leads, activities, followUps, updateLead, addActivity, addFollowUp, user } = useApp();
  const [activeTab, setActiveTab] = useState("Activity");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const lead = leads.find(l => l.id === id);
  const leadActivities = activities.filter(a => a.leadId === id);
  const leadFollowUps = followUps.filter(f => f.leadId === id);

  const handleStatusChange = (newStatus: typeof lead.status) => {
    if (!lead) return;
    updateLead(lead.id, { status: newStatus });
    addActivity({
      leadId: lead.id,
      type: 'status_change',
      title: `Status changed to ${newStatus}`,
      description: `Lead moved from ${lead.status} to ${newStatus}`,
      createdBy: user?.name || 'User'
    });
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAddNote = () => {
    if (!lead || !noteText.trim()) return;
    addActivity({
      leadId: lead.id,
      type: 'note',
      title: 'Note added',
      description: noteText,
      createdBy: user?.name || 'User'
    });
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note added successfully");
  };

  const handleLogCall = () => {
    if (!lead) return;
    const description = prompt("Enter call notes:");
    if (!description) return;
    
    addActivity({
      leadId: lead.id,
      type: 'call',
      title: 'Call logged',
      description,
      createdBy: user?.name || 'User'
    });
    toast.success("Call logged successfully");
  };

  if (!lead) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-900">Lead Not Found</h2>
        <Link to="/leads" className="text-blue-600 font-bold hover:underline mt-4">Back to Leads</Link>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'note': return <Edit3 className="w-5 h-5" />;
      case 'status_change': return <History className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-blue-600';
      case 'email': return 'text-amber-600';
      case 'note': return 'text-slate-600';
      case 'status_change': return 'text-emerald-600';
      default: return 'text-slate-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string): "primary" | "success" | "warning" | "danger" | "secondary" => {
    switch (status) {
      case 'New': return 'primary';
      case 'Contacted': return 'secondary';
      case 'Qualified': return 'warning';
      case 'Application': return 'warning';
      case 'Enrolled': return 'success';
      case 'Lost': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/leads" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-xs">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{lead.name}</h1>
            <Badge variant={getStatusColor(lead.status)}>{lead.status}</Badge>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Lead ID: {lead.id}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Application">Application</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Lost">Lost</option>
          </select>
          <Button variant="outline" size="sm" icon={Phone} onClick={handleLogCall} className="font-semibold shadow-xs">Log Call</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Student Info */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-4 border border-blue-200 shadow-sm">
                {lead.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{lead.name}</h2>
              <p className="text-sm text-slate-500 font-medium">Applied for {lead.course}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="primary" size="sm" icon={Phone} className="rounded-full w-10 h-10 p-0 justify-center shadow-lg shadow-blue-500/20" />
                <Button variant="outline" size="sm" icon={MessageSquare} className="rounded-full w-10 h-10 p-0 justify-center text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100" />
                <Button variant="outline" size="sm" icon={Mail} className="rounded-full w-10 h-10 p-0 justify-center text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100" />
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400">Email Address</span>
                    <span className="text-sm font-semibold text-slate-800">{lead.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400">Phone Number</span>
                    <span className="text-sm font-semibold text-slate-800">{lead.phone}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-4">Lead Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400">Primary Course</span>
                    <span className="text-sm font-semibold text-slate-800">{lead.course}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400">Lead Source</span>
                    <span className="text-sm font-semibold text-slate-800">{lead.source}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-slate-900 text-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Assigned To</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">
                {lead.assignedCounselor.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <span className="text-sm font-bold block">{lead.assignedCounselor}</span>
                <span className="text-[11px] text-slate-400 font-medium">Admission Counselor</span>
              </div>
            </div>
          </Card>

          {/* Follow-ups */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Follow-Ups</h3>
              <Badge variant="warning">{leadFollowUps.filter(f => !f.completed).length}</Badge>
            </div>
            <div className="space-y-3">
              {leadFollowUps.filter(f => !f.completed).slice(0, 3).map(followUp => (
                <div key={followUp.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" className="text-[10px]">{followUp.type}</Badge>
                    <span className="text-xs text-slate-500 font-semibold">{formatDate(followUp.dueDate)}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{followUp.description}</p>
                </div>
              ))}
              {leadFollowUps.filter(f => !f.completed).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No pending follow-ups</p>
              )}
            </div>
          </Card>
        </div>


        {/* Right Side: Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 border-slate-200">
            <div className="flex items-center border-b border-slate-100 overflow-x-auto">
              {["Activity", "Notes", "Follow-Ups"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                    activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              ))}
              <div className="ml-auto pr-4">
                <Button 
                  size="sm" 
                  icon={Plus} 
                  onClick={() => setShowNoteInput(true)}
                  className="h-8 py-0 px-2 font-bold text-xs bg-slate-900"
                >
                  Add Note
                </Button>
              </div>
            </div>

            <div className="p-6">
              {showNoteInput && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter your note..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px]"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleAddNote}>Save Note</Button>
                    <Button size="sm" variant="outline" onClick={() => { setShowNoteInput(false); setNoteText(""); }}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {activeTab === "Activity" && (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                  {leadActivities.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="font-semibold">No activity yet</p>
                      <p className="text-sm mt-1">Start by logging a call or adding a note</p>
                    </div>
                  ) : (
                    leadActivities.map((activity) => (
                      <div key={activity.id} className="relative flex items-start gap-6 group">
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm z-10 shrink-0 transition-transform group-hover:scale-110",
                          getActivityColor(activity.type)
                        )}>
                          {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex-1 pt-1.5 pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <span className="text-sm font-bold text-slate-900 uppercase">
                              {activity.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                              <Clock className="w-3 h-3" />
                              {formatDate(activity.createdAt)}
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-xs">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              {activity.description}
                            </p>
                            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                  {activity.createdBy[0]}
                                </div>
                                <span className="text-[11px] font-bold text-slate-500">Log by {activity.createdBy}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "Follow-Ups" && (
                <div className="space-y-3">
                  {leadFollowUps.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="font-semibold">No follow-ups scheduled</p>
                      <p className="text-sm mt-1">Schedule a follow-up to stay connected</p>
                    </div>
                  ) : (
                    leadFollowUps.map(followUp => (
                      <div key={followUp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={followUp.completed ? "success" : "warning"} className="text-[10px] uppercase">{followUp.type}</Badge>
                          <span className="text-xs text-slate-500 font-semibold">{formatDate(followUp.dueDate)}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 mb-1">{followUp.description}</p>
                        <p className="text-xs text-slate-500">By {followUp.createdBy}</p>
                        {followUp.completed && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <Badge variant="success" className="text-[10px]">Completed</Badge>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
