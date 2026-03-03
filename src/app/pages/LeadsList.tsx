import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Phone, 
  MessageSquare, 
  Calendar,
  MoreHorizontal,
  Trash2,
  UserCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router";
import { Card, Button, Badge } from "../components/UI";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { LeadFormModal } from "../components/LeadFormModal";
import { ConfirmDialog } from "../components/ConfirmDialog";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function LeadsList() {
  const { leads, followUps, deleteLead } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [counselorFilter, setCounselorFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; leadId: string; leadName: string }>({
    isOpen: false,
    leadId: '',
    leadName: ''
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      const matchesCounselor = counselorFilter === "All" || lead.assignedCounselor === counselorFilter;
      return matchesSearch && matchesStatus && matchesCounselor;
    });
  }, [leads, searchTerm, statusFilter, counselorFilter]);

  const handleDeleteLead = (id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, leadId: id, leadName: name });
  };

  const confirmDelete = () => {
    setDeletingId(deleteConfirm.leadId);
    setTimeout(() => {
      deleteLead(deleteConfirm.leadId);
      toast.success("Lead deleted successfully");
      setDeleteConfirm({ isOpen: false, leadId: '', leadName: '' });
      setDeletingId(null);
    }, 500);
  };

  const getNextFollowUp = (leadId: string) => {
    const leadFollowUps = followUps
      .filter(f => f.leadId === leadId && !f.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    if (leadFollowUps.length === 0) return "No follow-up";
    
    const nextFollowUp = leadFollowUps[0];
    const date = new Date(nextFollowUp.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUpDate = new Date(date);
    followUpDate.setHours(0, 0, 0, 0);
    
    if (followUpDate.getTime() === today.getTime()) return "Today";
    if (followUpDate.getTime() < today.getTime()) return "Overdue";
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const counselors = Array.from(new Set(leads.map(l => l.assignedCounselor)));
  const statuses = ['New', 'Contacted', 'Qualified', 'Application', 'Enrolled', 'Lost'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Leads</h1>
          <p className="text-slate-500 mt-1">Manage and track all student inquiries in one place.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="font-bold shadow-lg shadow-blue-500/20">
          Add New Lead
        </Button>
      </div>

      <LeadFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, leadId: '', leadName: '' })}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteConfirm.leadName}"? This will also delete all related activities and follow-ups. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <Card className="p-0 border-slate-200 shadow-sm overflow-visible">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 rounded-t-xl">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name, email or phone..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <select 
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select 
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
              value={counselorFilter}
              onChange={(e) => setCounselorFilter(e.target.value)}
            >
              <option value="All">All Counselors</option>
              {counselors.map(counselor => (
                <option key={counselor} value={counselor}>{counselor}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {filteredLeads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-bold text-slate-600">No leads found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4 font-bold">Student Details</th>
                  <th className="px-6 py-4 font-bold">Phone</th>
                  <th className="px-6 py-4 font-bold">Source</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Counselor</th>
                  <th className="px-6 py-4 font-bold">Next Follow-up</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 border border-slate-200">
                          {lead.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <Link to={`/leads/${lead.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline block leading-tight">
                            {lead.name}
                          </Link>
                          <span className="text-xs text-slate-500 font-medium">{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{lead.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                          {lead.assignedCounselor.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-600">{lead.assignedCounselor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-xs font-semibold">{getNextFollowUp(lead.id)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 rounded-b-xl">
          <span className="text-xs font-bold text-slate-500">Showing {filteredLeads.length} of {leads.length} leads</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="px-2" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <button 
                className="w-8 h-8 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/30"
              >
                1
              </button>
            </div>
            <Button variant="outline" size="sm" className="px-2" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
