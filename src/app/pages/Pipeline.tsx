import React, { useState } from "react";
import { 
  Plus, 
  Filter, 
  MoreVertical, 
  Phone, 
  MessageSquare, 
  Clock, 
  GripVertical
} from "lucide-react";
import { Link } from "react-router";
import { Card, Button, Badge } from "../components/UI";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { LeadFormModal } from "../components/LeadFormModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  LEAD: 'lead',
};

interface DraggableLeadProps {
  lead: any;
  moveLead: (id: string, newStatus: string) => void;
}

function DraggableLead({ lead, moveLead }: DraggableLeadProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.LEAD,
    item: { id: lead.id, status: lead.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const daysSinceCreated = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      ref={drag}
      layoutId={lead.id}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="p-4 group hover:border-blue-200 transition-colors relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/leads/${lead.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 group-hover:text-blue-600 transition-colors leading-tight truncate">
            {lead.name}
          </Link>
          <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-move" />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5">{lead.course}</Badge>
          <span className="text-[10px] text-slate-400 font-semibold">{lead.source}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100">
              {lead.assignedCounselor?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <span className="text-[11px] font-bold text-slate-500">{lead.assignedCounselor}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            {daysSinceCreated}d
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
          <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Phone className="w-3 h-3" /></button>
          <button className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"><MessageSquare className="w-3 h-3" /></button>
        </div>
      </Card>
    </motion.div>
  );
}

interface ColumnProps {
  title: string;
  leads: any[];
  moveLead: (id: string, newStatus: string) => void;
  onAddClick: () => void;
}

function Column({ title, leads, moveLead, onAddClick }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType.LEAD,
    drop: (item: { id: string, status: string }) => {
      if (item.status !== title) {
        moveLead(item.id, title);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`w-80 flex flex-col h-full rounded-2xl border transition-colors ${isOver ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/50 border-slate-100'} p-3`}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h3>
          <Badge className="bg-white border-slate-200 text-slate-500 h-5 flex items-center justify-center font-bold px-1.5">{leads.length}</Badge>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
        {leads.map((lead: any) => (
          <DraggableLead key={lead.id} lead={lead} moveLead={moveLead} />
        ))}
        
        <button 
          onClick={onAddClick}
          className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 border border-dashed border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 hover:text-slate-600 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Card
        </button>
      </div>
    </div>
  );
}

export function Pipeline() {
  const { leads, updateLead, addActivity, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statuses: Array<'New' | 'Contacted' | 'Qualified' | 'Application' | 'Enrolled' | 'Lost'> = [
    'New', 'Contacted', 'Qualified', 'Application', 'Enrolled', 'Lost'
  ];

  const groupedLeads = statuses.reduce((acc, status) => {
    acc[status] = leads.filter(lead => lead.status === status);
    return acc;
  }, {} as Record<string, any[]>);

  const moveLead = (id: string, newStatus: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    updateLead(id, { status: newStatus as any });
    
    // Add activity
    addActivity({
      leadId: id,
      type: 'status_change',
      title: `Status changed to ${newStatus}`,
      description: `Lead moved from ${lead.status} to ${newStatus}`,
      createdBy: user?.name || 'User'
    });
    
    toast.success(`Moved lead to ${newStatus}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lead Pipeline</h1>
            <p className="text-slate-500 mt-1">Track student progress through the admission funnel.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={Filter} className="font-semibold shadow-xs">Filters</Button>
            <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="font-bold shadow-lg shadow-blue-500/20">Add Lead</Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-6 min-w-max h-full">
            {statuses.map((status) => (
              <Column 
                key={status} 
                title={status} 
                leads={groupedLeads[status] || []} 
                moveLead={moveLead}
                onAddClick={() => setIsModalOpen(true)}
              />
            ))}
          </div>
        </div>

        <LeadFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </DndProvider>
  );
}
