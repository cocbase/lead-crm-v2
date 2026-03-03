import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { Button } from "./UI";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const { addLead, counselors } = useApp();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const counselor = counselors.find(c => c.id === data.assignedTo);
      
      addLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        status: data.status,
        assignedTo: data.assignedTo,
        assignedCounselor: counselor?.name || 'Unassigned',
        course: data.course,
      });
      
      toast.success("Lead created successfully!");
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Student Lead</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message as string}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Lead Source</label>
                  <select
                    {...register("source", { required: "Source is required" })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Course Interested</label>
                  <select
                    {...register("course", { required: "Course is required" })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="MBA">MBA</option>
                    <option value="BBA">BBA</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Initial Status</label>
                  <select
                    {...register("status", { required: "Status is required" })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Application">Application</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Assign Counselor</label>
                <select
                  {...register("assignedTo", { required: "Counselor is required" })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  {counselors.map(counselor => (
                    <option key={counselor.id} value={counselor.id}>{counselor.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-bold">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 font-bold shadow-lg shadow-blue-500/20">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Lead"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
