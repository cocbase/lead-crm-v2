import React, { useState, useMemo } from "react";
import { Plus, Calendar, Phone, Mail, Video, CheckCircle2, Clock, AlertCircle, UserCircle2 } from "lucide-react";
import { Link } from "react-router";
import { Card, Button, Badge } from "../components/UI";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { FollowUpFormModal } from "../components/FollowUpFormModal";

type TabType = 'today' | 'upcoming' | 'overdue' | 'completed';

export function FollowUps() {
  const { followUps, leads, updateFollowUp } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categorizedFollowUps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      today: followUps.filter(f => {
        const dueDate = new Date(f.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime() && !f.completed;
      }),
      upcoming: followUps.filter(f => {
        const dueDate = new Date(f.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() > today.getTime() && !f.completed;
      }),
      overdue: followUps.filter(f => {
        const dueDate = new Date(f.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() < today.getTime() && !f.completed;
      }),
      completed: followUps.filter(f => f.completed),
    };
  }, [followUps]);

  const displayedFollowUps = categorizedFollowUps[activeTab];

  const handleMarkComplete = (id: string) => {
    updateFollowUp(id, { completed: true, completedAt: new Date().toISOString() });
    toast.success("Follow-up marked as completed");
  };

  const handleMarkIncomplete = (id: string) => {
    updateFollowUp(id, { completed: false, completedAt: undefined });
    toast.success("Follow-up marked as incomplete");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'email': return 'bg-purple-100 text-purple-600';
      case 'meeting': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Follow-Ups</h1>
          <p className="text-slate-500 mt-1">Manage and track all scheduled follow-ups with students.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="font-bold shadow-lg shadow-blue-500/20">
          Schedule Follow-Up
        </Button>
      </div>

      <FollowUpFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Today</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{categorizedFollowUps.today.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Upcoming</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{categorizedFollowUps.upcoming.length}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Overdue</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{categorizedFollowUps.overdue.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Completed</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{categorizedFollowUps.completed.length}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {(['today', 'upcoming', 'overdue', 'completed'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-3">
        {displayedFollowUps.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-bold text-slate-600">No follow-ups in this category</p>
            <p className="text-sm text-slate-400 mt-1">
              {activeTab === 'today' && "You're all caught up for today!"}
              {activeTab === 'upcoming' && "No upcoming follow-ups scheduled."}
              {activeTab === 'overdue' && "Great! No overdue follow-ups."}
              {activeTab === 'completed' && "No completed follow-ups yet."}
            </p>
          </Card>
        ) : (
          displayedFollowUps.map((followUp) => {
            const lead = leads.find(l => l.id === followUp.leadId);
            const isOverdue = new Date(followUp.dueDate) < new Date() && !followUp.completed;
            
            return (
              <motion.div
                key={followUp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`p-5 hover:shadow-md transition-all ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${followUp.completed ? 'bg-slate-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${getTypeColor(followUp.type)}`}>
                      {getTypeIcon(followUp.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <Link to={`/leads/${followUp.leadId}`} className="text-base font-bold text-slate-900 hover:text-blue-600 hover:underline">
                            {followUp.leadName}
                          </Link>
                          <p className="text-sm text-slate-600 mt-1">{followUp.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!followUp.completed ? (
                            <Button size="sm" onClick={() => handleMarkComplete(followUp.id)} className="px-3 py-1">
                              Mark Complete
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleMarkIncomplete(followUp.id)} className="px-3 py-1">
                              Reopen
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-semibold">{formatDate(followUp.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">Course: {lead?.course || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">Assigned to: {followUp.createdBy}</span>
                        </div>
                        {isOverdue && (
                          <Badge variant="danger" className="text-[10px]">OVERDUE</Badge>
                        )}
                        {followUp.completed && (
                          <Badge variant="success" className="text-[10px]">COMPLETED</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
