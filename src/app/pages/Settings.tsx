import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Database, 
  CreditCard, 
  Mail, 
  Phone, 
  Moon, 
  Sun,
  ChevronRight,
  Shield,
  Smartphone,
  Save,
  Trash2,
  Check,
  Loader2
} from "lucide-react";
import { Card, Button, Badge } from "../components/UI";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function Settings() {
  const { settings, updateSettings, user } = useApp();
  const [activeCategory, setActiveCategory] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  
  // Safety check for settings initialization
  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  // Local form state
  const [profileForm, setProfileForm] = useState(settings.profile);
  const [preferencesForm, setPreferencesForm] = useState(settings.preferences);
  const [notificationsForm, setNotificationsForm] = useState(settings.notifications);
  const [securityForm, setSecurityForm] = useState(settings.security);

  const categories = [
    { id: "Profile", icon: User, label: "Profile Information", description: "Your personal details and photo" },
    { id: "Preferences", icon: Globe, label: "Preferences", description: "Theme, language, and timezone" },
    { id: "Notifications", icon: Bell, label: "Notification Settings", description: "Control how you receive alerts" },
    { id: "Security", icon: Lock, label: "Account & Security", description: "Password, MFA and login history" },
    { id: "Workspace", icon: Database, label: "Workspace Data", description: "Lead fields, statuses and pipeline", disabled: true },
    { id: "Billing", icon: CreditCard, label: "Plan & Billing", description: "Manage subscriptions and invoices", disabled: true },
  ];

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ profile: profileForm });
      toast.success("Profile updated successfully!");
      setIsSaving(false);
    }, 800);
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ preferences: preferencesForm });
      toast.success("Preferences updated successfully!");
      setIsSaving(false);
    }, 800);
  };

  const handleSaveNotifications = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ notifications: notificationsForm });
      toast.success("Notification settings updated!");
      setIsSaving(false);
    }, 800);
  };

  const handleSaveSecurity = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ security: securityForm });
      toast.success("Security settings updated!");
      setIsSaving(false);
    }, 800);
  };

  const renderContent = () => {
    switch (activeCategory) {
      case "Profile":
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-start gap-8 flex-col sm:flex-row">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 border-2 border-white shadow-xl ring-4 ring-blue-50 shrink-0 overflow-hidden">
                  {profileForm.firstName[0]}{profileForm.lastName[0]}
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline" onClick={() => toast.info("Photo upload is demo-only")}>
                  Change Photo
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                  <input 
                    type="text" 
                    value={profileForm.firstName} 
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                  <input 
                    type="text" 
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold" 
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold" 
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                  <input 
                    type="text" 
                    value={profileForm.jobTitle}
                    onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setProfileForm(settings.profile)}
                disabled={isSaving}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="font-bold shadow-lg shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case "Preferences":
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-800 block leading-tight">Appearance Theme</span>
                  <span className="text-xs text-slate-400 font-medium">Toggle between light and dark themes</span>
                </div>
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setPreferencesForm({ ...preferencesForm, theme: 'light' })}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      preferencesForm.theme === 'light' 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setPreferencesForm({ ...preferencesForm, theme: 'dark' })}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      preferencesForm.theme === 'dark' 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Language</label>
                <select
                  value={preferencesForm.language}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, language: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date Format</label>
                <select
                  value={preferencesForm.dateFormat}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, dateFormat: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Zone</label>
                <select
                  value={preferencesForm.timeZone}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, timeZone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setPreferencesForm(settings.preferences)}
                disabled={isSaving}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="font-bold shadow-lg shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Email Notifications</h4>
                </div>
                <div className="space-y-3">
                  <ToggleOption
                    label="New Lead Assignments"
                    description="Get notified when a new lead is assigned to you"
                    checked={notificationsForm.email.newLeads}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      email: { ...notificationsForm.email, newLeads: checked }
                    })}
                  />
                  <ToggleOption
                    label="Follow-up Reminders"
                    description="Receive reminders before scheduled follow-ups"
                    checked={notificationsForm.email.followUpReminders}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      email: { ...notificationsForm.email, followUpReminders: checked }
                    })}
                  />
                  <ToggleOption
                    label="Weekly Reports"
                    description="Get weekly performance and activity summaries"
                    checked={notificationsForm.email.weeklyReports}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      email: { ...notificationsForm.email, weeklyReports: checked }
                    })}
                  />
                  <ToggleOption
                    label="System Updates"
                    description="Important updates about LeadCRM"
                    checked={notificationsForm.email.systemUpdates}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      email: { ...notificationsForm.email, systemUpdates: checked }
                    })}
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Push Notifications</h4>
                </div>
                <div className="space-y-3">
                  <ToggleOption
                    label="Enable Push Notifications"
                    description="Allow browser notifications on this device"
                    checked={notificationsForm.push.enabled}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      push: { ...notificationsForm.push, enabled: checked }
                    })}
                  />
                  <ToggleOption
                    label="New Leads"
                    description="Push notification for new lead assignments"
                    checked={notificationsForm.push.newLeads}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      push: { ...notificationsForm.push, newLeads: checked }
                    })}
                    disabled={!notificationsForm.push.enabled}
                  />
                  <ToggleOption
                    label="Follow-up Reminders"
                    description="Push notification before scheduled tasks"
                    checked={notificationsForm.push.followUpReminders}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      push: { ...notificationsForm.push, followUpReminders: checked }
                    })}
                    disabled={!notificationsForm.push.enabled}
                  />
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">In-App Notifications</h4>
                </div>
                <div className="space-y-3">
                  <ToggleOption
                    label="Enable In-App Alerts"
                    description="Show notifications within the application"
                    checked={notificationsForm.inApp.enabled}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      inApp: { ...notificationsForm.inApp, enabled: checked }
                    })}
                  />
                  <ToggleOption
                    label="Notification Sound"
                    description="Play sound when notifications appear"
                    checked={notificationsForm.inApp.sound}
                    onChange={(checked) => setNotificationsForm({
                      ...notificationsForm,
                      inApp: { ...notificationsForm.inApp, sound: checked }
                    })}
                    disabled={!notificationsForm.inApp.enabled}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setNotificationsForm(settings.notifications)}
                disabled={isSaving}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="font-bold shadow-lg shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case "Security":
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-800 block leading-tight">Two-Factor Authentication</span>
                  <span className="text-xs text-slate-400 font-medium">Extra layer of security for your account</span>
                </div>
                <Toggle
                  checked={securityForm.twoFactorEnabled}
                  onChange={(checked) => setSecurityForm({ ...securityForm, twoFactorEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Timeout</label>
                <select
                  value={securityForm.sessionTimeout}
                  onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeout: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                </select>
                <p className="text-xs text-slate-400 font-medium">Automatically log out after inactivity</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-800 block leading-tight">Login Alerts</span>
                  <span className="text-xs text-slate-400 font-medium">Email me when there's a new login</span>
                </div>
                <Toggle
                  checked={securityForm.loginAlerts}
                  onChange={(checked) => setSecurityForm({ ...securityForm, loginAlerts: checked })}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mt-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-blue-900">Change Password</h5>
                    <p className="text-xs text-blue-600 mt-1 font-medium leading-relaxed">
                      For security reasons, password changes require verification. This is a demo mode.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-100"
                      onClick={() => toast.info("Password change is demo-only")}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setSecurityForm(settings.security)}
                disabled={isSaving}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSaveSecurity}
                disabled={isSaving}
                className="font-bold shadow-lg shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case "Workspace":
      case "Billing":
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Demo Mode Only</h3>
              <p className="text-sm text-slate-500">
                This section is not available in the demo version. 
                In production, this would contain {activeCategory.toLowerCase()} management features.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your personal preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => !cat.disabled && setActiveCategory(cat.id)}
              disabled={cat.disabled}
              className={cn(
                "w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all group",
                cat.disabled && "opacity-50 cursor-not-allowed",
                activeCategory === cat.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                activeCategory === cat.id ? "bg-blue-500" : "bg-slate-100 group-hover:bg-slate-200"
              )}>
                <cat.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold block leading-tight truncate">{cat.label}</span>
                <span className={cn(
                  "text-[10px] font-medium leading-none mt-1 line-clamp-1",
                  activeCategory === cat.id ? "text-blue-100" : "text-slate-400"
                )}>
                  {cat.description}
                </span>
              </div>
              <ChevronRight className={cn("w-4 h-4 shrink-0 opacity-50", activeCategory === cat.id ? "opacity-100" : "")} />
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-0 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeCategory}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
            </div>

            <div className="p-6">
              {renderContent()}
            </div>
          </Card>

          {/* Danger Zone */}
          {activeCategory === "Security" && (
            <Card className="p-6 border-rose-100 bg-rose-50/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-900">Delete Account</h3>
                  <p className="text-xs text-rose-600 mt-1 font-medium leading-relaxed">
                    Permanently remove your account and all associated data from LeadCRM. This action is irreversible.
                  </p>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="mt-4 font-bold shadow-md shadow-rose-500/10"
                    onClick={() => toast.error("Account deletion is disabled in demo mode")}
                  >
                    Delete Permanently
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Toggle Component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

// Toggle Option Component
function ToggleOption({ 
  label, 
  description, 
  checked, 
  onChange,
  disabled = false
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200",
      disabled && "opacity-50"
    )}>
      <div className="flex-1">
        <span className="text-sm font-bold text-slate-800 block leading-tight">{label}</span>
        <span className="text-xs text-slate-400 font-medium">{description}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
