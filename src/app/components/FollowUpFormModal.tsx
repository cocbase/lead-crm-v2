import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, Clock } from "lucide-react";
import { Button } from "./UI";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

interface FollowUpFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  leadName?: string;
}

export function FollowUpFormModal({ isOpen, onClose, leadId, leadName }: FollowUpFormModalProps) {
  const { addFollowUp, leads, user } = useApp();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Combine date and time into ISO string
    const dueDateTime = new Date(`${data.dueDate}T${data.dueTime}`);
    const lead = leads.find(l => l.id === (leadId || data.leadId));
    
    setTimeout(() => {
      addFollowUp({
        leadId: leadId || data.leadId,
        leadName: leadName || lead?.name || 'Unknown Lead',
        type: data.type,
        description: data.description,
        dueDate: dueDateTime.toISOString(),
        createdBy: user?.name || 'User',
      });
      
      toast.success("Follow-up scheduled successfully!");
      reset();
      onClose();
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Schedule Follow-Up</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {!leadId && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Lead</label>
                  <select
                    {...register("leadId", { required: "Lead is required" })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
                  >
                    <option value="">Choose a student...</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.name}</option>
                    ))}
                  </select>
                  {errors.leadId && <p className="text-xs text-red-500 font-medium">{errors.leadId.message as string}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Follow-Up Type</label>
                <select
                  {...register("type", { required: "Type is required" })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
                >
                  <option value="call">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">In-Person Meeting</option>
                </select>
                {errors.type && <p className="text-xs text-red-500 font-medium">{errors.type.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Due Date
                  </label>
                  <input
                    {...register("dueDate", { required: "Date is required" })}
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dueDate && <p className="text-xs text-red-500 font-medium">{errors.dueDate.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Time
                  </label>
                  <input
                    {...register("dueTime", { required: "Time is required" })}
                    type="time"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
                  />
                  {errors.dueTime && <p className="text-xs text-red-500 font-medium">{errors.dueTime.message as string}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description / Notes</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                  placeholder="What needs to be discussed..."
                />
                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message as string}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="font-semibold"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="font-bold shadow-lg shadow-blue-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Follow-Up"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
