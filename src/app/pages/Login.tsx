import React, { useState } from "react";
import { useNavigate } from "react-router";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button, Card } from "../components/UI";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@leadcrm.edu");
  const [password, setPassword] = useState("password123");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Try: admin@leadcrm.edu");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">LeadCRM</h1>
          <p className="mt-2 text-slate-500 font-medium">Education Lead Management System</p>
        </div>

        <Card className="p-8 shadow-xl border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full py-3.5 font-bold tracking-wide shadow-md group" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <div className="flex items-center justify-center">
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Admin:</strong> admin@leadcrm.edu</p>
              <p><strong>Counselor 1:</strong> sarah@leadcrm.edu</p>
              <p><strong>Counselor 2:</strong> michael@leadcrm.edu</p>
              <p className="text-blue-600 mt-2">Password: any</p>
            </div>
          </div>
        </Card>

        <p className="text-center mt-6 text-xs text-slate-400">
          Demo Version - All data is stored locally
        </p>
      </motion.div>
    </div>
  );
}
