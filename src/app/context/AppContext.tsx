import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Counselor';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Application' | 'Enrolled' | 'Lost';
  assignedTo: string;
  assignedCounselor: string;
  course: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'note' | 'email' | 'status_change' | 'assignment';
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  type: 'call' | 'email' | 'meeting';
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'new_lead' | 'follow_up_reminder' | 'lead_update' | 'system';
  title: string;
  message: string;
  leadId?: string;
  leadName?: string;
  read: boolean;
  createdAt: string;
}

export interface AppSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    photoUrl?: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'es' | 'fr';
    timeZone: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  };
  notifications: {
    email: {
      newLeads: boolean;
      followUpReminders: boolean;
      weeklyReports: boolean;
      systemUpdates: boolean;
    };
    push: {
      enabled: boolean;
      newLeads: boolean;
      followUpReminders: boolean;
    };
    inApp: {
      enabled: boolean;
      sound: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
  };
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  leads: Lead[];
  activities: Activity[];
  followUps: FollowUp[];
  notifications: Notification[];
  counselors: User[];
  lastUpdated: Date;
  settings: AppSettings;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'createdAt' | 'completed'>) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Users
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@leadcrm.edu', role: 'Admin' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@leadcrm.edu', role: 'Counselor' },
  { id: '3', name: 'Michael Chen', email: 'michael@leadcrm.edu', role: 'Counselor' },
];

// Mock Leads - 25 sample leads
const mockLeads: Lead[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91-9876543210', source: 'Facebook', status: 'New', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'MBA', createdAt: '2025-02-24T10:30:00Z', updatedAt: '2025-02-24T10:30:00Z' },
  { id: '2', name: 'Rahul Verma', email: 'rahul.v@email.com', phone: '+91-9876543211', source: 'Website', status: 'Contacted', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'BBA', createdAt: '2025-02-23T09:15:00Z', updatedAt: '2025-02-24T11:00:00Z' },
  { id: '3', name: 'Ananya Patel', email: 'ananya.p@email.com', phone: '+91-9876543212', source: 'Instagram', status: 'Qualified', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'B.Tech', createdAt: '2025-02-22T14:20:00Z', updatedAt: '2025-02-24T09:30:00Z' },
  { id: '4', name: 'Arjun Reddy', email: 'arjun.r@email.com', phone: '+91-9876543213', source: 'Referral', status: 'Application', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'M.Tech', createdAt: '2025-02-20T11:45:00Z', updatedAt: '2025-02-23T16:20:00Z' },
  { id: '5', name: 'Neha Gupta', email: 'neha.g@email.com', phone: '+91-9876543214', source: 'Facebook', status: 'Enrolled', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'MBA', createdAt: '2025-02-15T08:30:00Z', updatedAt: '2025-02-22T10:00:00Z' },
  { id: '6', name: 'Vikram Singh', email: 'vikram.s@email.com', phone: '+91-9876543215', source: 'Website', status: 'New', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'BCA', createdAt: '2025-02-24T12:00:00Z', updatedAt: '2025-02-24T12:00:00Z' },
  { id: '7', name: 'Divya Nair', email: 'divya.n@email.com', phone: '+91-9876543216', source: 'Instagram', status: 'Contacted', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MCA', createdAt: '2025-02-23T15:30:00Z', updatedAt: '2025-02-24T08:45:00Z' },
  { id: '8', name: 'Karan Malhotra', email: 'karan.m@email.com', phone: '+91-9876543217', source: 'Facebook', status: 'Lost', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'BBA', createdAt: '2025-02-18T10:00:00Z', updatedAt: '2025-02-21T14:30:00Z' },
  { id: '9', name: 'Riya Kapoor', email: 'riya.k@email.com', phone: '+91-9876543218', source: 'Website', status: 'Qualified', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MBA', createdAt: '2025-02-21T13:15:00Z', updatedAt: '2025-02-23T10:20:00Z' },
  { id: '10', name: 'Aditya Kumar', email: 'aditya.k@email.com', phone: '+91-9876543219', source: 'Referral', status: 'Application', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'B.Tech', createdAt: '2025-02-19T09:30:00Z', updatedAt: '2025-02-23T11:45:00Z' },
  { id: '11', name: 'Pooja Desai', email: 'pooja.d@email.com', phone: '+91-9876543220', source: 'Instagram', status: 'New', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'BCA', createdAt: '2025-02-24T11:20:00Z', updatedAt: '2025-02-24T11:20:00Z' },
  { id: '12', name: 'Rohan Joshi', email: 'rohan.j@email.com', phone: '+91-9876543221', source: 'Facebook', status: 'Contacted', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'MBA', createdAt: '2025-02-23T08:00:00Z', updatedAt: '2025-02-24T09:15:00Z' },
  { id: '13', name: 'Sneha Iyer', email: 'sneha.i@email.com', phone: '+91-9876543222', source: 'Website', status: 'Enrolled', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'M.Tech', createdAt: '2025-02-10T14:30:00Z', updatedAt: '2025-02-20T16:00:00Z' },
  { id: '14', name: 'Amit Rao', email: 'amit.r@email.com', phone: '+91-9876543223', source: 'Referral', status: 'Qualified', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'BBA', createdAt: '2025-02-22T10:45:00Z', updatedAt: '2025-02-24T08:30:00Z' },
  { id: '15', name: 'Kavya Menon', email: 'kavya.m@email.com', phone: '+91-9876543224', source: 'Instagram', status: 'Application', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MBA', createdAt: '2025-02-20T16:20:00Z', updatedAt: '2025-02-23T13:00:00Z' },
  { id: '16', name: 'Sanjay Pillai', email: 'sanjay.p@email.com', phone: '+91-9876543225', source: 'Facebook', status: 'New', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'B.Tech', createdAt: '2025-02-24T13:45:00Z', updatedAt: '2025-02-24T13:45:00Z' },
  { id: '17', name: 'Meera Krishnan', email: 'meera.k@email.com', phone: '+91-9876543226', source: 'Website', status: 'Contacted', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MCA', createdAt: '2025-02-23T11:30:00Z', updatedAt: '2025-02-24T10:00:00Z' },
  { id: '18', name: 'Varun Bhatt', email: 'varun.b@email.com', phone: '+91-9876543227', source: 'Referral', status: 'Lost', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'BCA', createdAt: '2025-02-17T09:15:00Z', updatedAt: '2025-02-20T12:30:00Z' },
  { id: '19', name: 'Ishita Saxena', email: 'ishita.s@email.com', phone: '+91-9876543228', source: 'Instagram', status: 'Qualified', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MBA', createdAt: '2025-02-21T15:00:00Z', updatedAt: '2025-02-23T14:20:00Z' },
  { id: '20', name: 'Harsh Agarwal', email: 'harsh.a@email.com', phone: '+91-9876543229', source: 'Facebook', status: 'Application', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'B.Tech', createdAt: '2025-02-19T12:00:00Z', updatedAt: '2025-02-23T09:45:00Z' },
  { id: '21', name: 'Tanvi Shah', email: 'tanvi.s@email.com', phone: '+91-9876543230', source: 'Website', status: 'Enrolled', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MBA', createdAt: '2025-02-12T10:20:00Z', updatedAt: '2025-02-21T11:00:00Z' },
  { id: '22', name: 'Nikhil Pandey', email: 'nikhil.p@email.com', phone: '+91-9876543231', source: 'Referral', status: 'New', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'BBA', createdAt: '2025-02-24T09:00:00Z', updatedAt: '2025-02-24T09:00:00Z' },
  { id: '23', name: 'Simran Kaur', email: 'simran.k@email.com', phone: '+91-9876543232', source: 'Instagram', status: 'Contacted', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MCA', createdAt: '2025-02-23T14:15:00Z', updatedAt: '2025-02-24T11:30:00Z' },
  { id: '24', name: 'Akash Mehta', email: 'akash.m@email.com', phone: '+91-9876543233', source: 'Facebook', status: 'Qualified', assignedTo: '2', assignedCounselor: 'Sarah Johnson', course: 'B.Tech', createdAt: '2025-02-22T08:45:00Z', updatedAt: '2025-02-24T10:15:00Z' },
  { id: '25', name: 'Nisha Chopra', email: 'nisha.c@email.com', phone: '+91-9876543234', source: 'Website', status: 'Application', assignedTo: '3', assignedCounselor: 'Michael Chen', course: 'MBA', createdAt: '2025-02-20T13:30:00Z', updatedAt: '2025-02-23T15:45:00Z' },
];

// Mock Activities
const mockActivities: Activity[] = [
  { id: '1', leadId: '2', type: 'call', title: 'Initial contact call', description: 'Discussed MBA program details and admission process', createdBy: 'Michael Chen', createdAt: '2025-02-24T11:00:00Z' },
  { id: '2', leadId: '3', type: 'note', title: 'Student interested in B.Tech', description: 'Wants to know about Computer Science specialization', createdBy: 'Sarah Johnson', createdAt: '2025-02-24T09:30:00Z' },
  { id: '3', leadId: '5', type: 'status_change', title: 'Status changed to Enrolled', description: 'Completed admission process', createdBy: 'Sarah Johnson', createdAt: '2025-02-22T10:00:00Z' },
  { id: '4', leadId: '7', type: 'email', title: 'Sent program brochure', description: 'Emailed MCA program details and fee structure', createdBy: 'Michael Chen', createdAt: '2025-02-24T08:45:00Z' },
  { id: '5', leadId: '12', type: 'call', title: 'Follow-up call', description: 'Answered questions about scholarships', createdBy: 'Sarah Johnson', createdAt: '2025-02-24T09:15:00Z' },
];

// Mock Follow-ups with some overdue
const mockFollowUps: FollowUp[] = [
  { id: '1', leadId: '2', leadName: 'Rahul Verma', type: 'call', description: 'Follow up on MBA application', dueDate: '2025-02-24T14:00:00Z', completed: false, createdBy: 'Michael Chen', createdAt: '2025-02-23T09:15:00Z' },
  { id: '2', leadId: '3', leadName: 'Ananya Patel', type: 'meeting', description: 'Campus tour scheduled', dueDate: '2025-02-25T10:00:00Z', completed: false, createdBy: 'Sarah Johnson', createdAt: '2025-02-22T14:20:00Z' },
  { id: '3', leadId: '6', leadName: 'Vikram Singh', type: 'email', description: 'Send BCA course details', dueDate: '2025-02-24T16:00:00Z', completed: false, createdBy: 'Sarah Johnson', createdAt: '2025-02-24T12:00:00Z' },
  { id: '4', leadId: '7', leadName: 'Divya Nair', type: 'call', description: 'Discuss MCA admission requirements', dueDate: '2025-02-23T15:00:00Z', completed: false, createdBy: 'Michael Chen', createdAt: '2025-02-23T15:30:00Z' },
  { id: '5', leadId: '9', leadName: 'Riya Kapoor', type: 'call', description: 'Check application status', dueDate: '2025-02-26T11:00:00Z', completed: false, createdBy: 'Michael Chen', createdAt: '2025-02-21T13:15:00Z' },
  { id: '6', leadId: '11', leadName: 'Pooja Desai', type: 'email', description: 'Send admission form', dueDate: '2025-02-25T09:00:00Z', completed: false, createdBy: 'Michael Chen', createdAt: '2025-02-24T11:20:00Z' },
];

// Mock Notifications - Demo data
const mockNotifications: Notification[] = [
  { id: '1', type: 'new_lead', title: 'New Lead Assigned', message: 'Priya Sharma has been assigned to you', leadId: '1', leadName: 'Priya Sharma', read: false, createdAt: '2025-02-25T10:30:00Z' },
  { id: '2', type: 'follow_up_reminder', title: 'Follow-up Due Soon', message: 'Call with Rahul Verma is due in 2 hours', leadId: '2', leadName: 'Rahul Verma', read: false, createdAt: '2025-02-25T09:00:00Z' },
  { id: '3', type: 'lead_update', title: 'Lead Status Changed', message: 'Ananya Patel moved to Qualified stage', leadId: '3', leadName: 'Ananya Patel', read: true, createdAt: '2025-02-24T16:20:00Z' },
  { id: '4', type: 'follow_up_reminder', title: 'Meeting Reminder', message: 'Campus tour with Ananya Patel tomorrow at 10:00 AM', leadId: '3', leadName: 'Ananya Patel', read: false, createdAt: '2025-02-24T14:00:00Z' },
  { id: '5', type: 'system', title: 'Weekly Report Ready', message: 'Your weekly performance summary is now available', read: true, createdAt: '2025-02-24T08:00:00Z' },
];

// Default Settings
const defaultSettings: AppSettings = {
  profile: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@leadcrm.edu',
    jobTitle: 'Senior Admission Counselor',
    photoUrl: undefined,
  },
  preferences: {
    theme: 'light',
    language: 'en',
    timeZone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
  },
  notifications: {
    email: {
      newLeads: true,
      followUpReminders: true,
      weeklyReports: true,
      systemUpdates: false,
    },
    push: {
      enabled: false,
      newLeads: false,
      followUpReminders: false,
    },
    inApp: {
      enabled: true,
      sound: true,
    },
  },
  security: {
    twoFactorEnabled: true,
    sessionTimeout: 30,
    loginAlerts: true,
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Initialize state from localStorage or use mock data
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('leadcrm_leads');
    return saved ? JSON.parse(saved) : mockLeads;
  });
  
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('leadcrm_activities');
    return saved ? JSON.parse(saved) : mockActivities;
  });
  
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem('leadcrm_followups');
    return saved ? JSON.parse(saved) : mockFollowUps;
  });

  // Initialize notifications from localStorage or use mock data
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('leadcrm_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('leadcrm_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('leadcrm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Sync leads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leadcrm_leads', JSON.stringify(leads));
    setLastUpdated(new Date());
  }, [leads]);

  // Sync activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leadcrm_activities', JSON.stringify(activities));
    setLastUpdated(new Date());
  }, [activities]);

  // Sync followUps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leadcrm_followups', JSON.stringify(followUps));
    setLastUpdated(new Date());
  }, [followUps]);

  // Sync notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leadcrm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('leadcrm_settings', JSON.stringify(settings));
  }, [settings]);

  // Demo: Generate periodic notifications for demonstration (every 60 seconds)
  useEffect(() => {
    if (!user || !settings.notifications.inApp.enabled) return;

    const demoMessages = [
      { type: 'follow_up_reminder' as const, title: 'Follow-up Due Soon', getMessage: () => {
        const upcomingFollowUp = followUps.find(f => !f.completed);
        return upcomingFollowUp 
          ? `${upcomingFollowUp.type.charAt(0).toUpperCase() + upcomingFollowUp.type.slice(1)} with ${upcomingFollowUp.leadName} is due soon`
          : 'You have upcoming follow-ups to complete';
      }},
      { type: 'lead_update' as const, title: 'Lead Activity', getMessage: () => {
        const recentLead = leads[Math.floor(Math.random() * Math.min(3, leads.length))];
        return recentLead ? `${recentLead.name} viewed your email` : 'New activity on your leads';
      }},
      { type: 'system' as const, title: 'Daily Summary', getMessage: () => 
        `You have ${leads.filter(l => l.status === 'New').length} new leads to review`
      },
    ];

    const interval = setInterval(() => {
      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      const upcomingFollowUp = followUps.find(f => !f.completed);
      
      addNotification({
        type: randomMessage.type,
        title: randomMessage.title,
        message: randomMessage.getMessage(),
        leadId: upcomingFollowUp?.leadId,
        leadName: upcomingFollowUp?.leadName,
      });
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [user, settings.notifications.inApp.enabled, followUps, leads]);

  const login = (email: string, password: string): boolean => {
    // Simple mock login - accept any password for demo
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('leadcrm_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('leadcrm_user');
  };

  // Notification management functions (defined early so they can be used by other functions)
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    // Only add notification if in-app notifications are enabled
    if (!settings.notifications.inApp.enabled) return;

    const newNotification: Notification = {
      ...notification,
      id: String(Date.now()),
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);

    // Play notification sound if enabled
    if (settings.notifications.inApp.sound) {
      try {
        // Simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        // Silent fail if audio context is not available
        console.log('Audio notification not available');
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...lead,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    
    // Auto-generate notification for new lead if enabled
    if (settings.notifications.inApp.enabled) {
      setTimeout(() => {
        addNotification({
          type: 'new_lead',
          title: 'New Lead Assigned',
          message: `${newLead.name} has been assigned to you`,
          leadId: newLead.id,
          leadName: newLead.name,
        });
      }, 500);
    }
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id 
        ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
        : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    setActivities(prev => prev.filter(activity => activity.leadId !== id));
    setFollowUps(prev => prev.filter(followUp => followUp.leadId !== id));
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addFollowUp = (followUp: Omit<FollowUp, 'id' | 'createdAt' | 'completed'>) => {
    const newFollowUp: FollowUp = {
      ...followUp,
      id: String(Date.now()),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setFollowUps(prev => [newFollowUp, ...prev]);
    
    // Auto-generate notification for new follow-up if enabled
    if (settings.notifications.inApp.enabled) {
      setTimeout(() => {
        addNotification({
          type: 'follow_up_reminder',
          title: 'New Follow-up Scheduled',
          message: `${newFollowUp.type.charAt(0).toUpperCase() + newFollowUp.type.slice(1)} with ${newFollowUp.leadName} scheduled`,
          leadId: newFollowUp.leadId,
          leadName: newFollowUp.leadName,
        });
      }, 500);
    }
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUp>) => {
    setFollowUps(prev => prev.map(followUp => 
      followUp.id === id 
        ? { ...followUp, ...updates }
        : followUp
    ));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(followUp => followUp.id !== id));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
      // Deep merge for nested objects
      profile: updates.profile ? { ...prev.profile, ...updates.profile } : prev.profile,
      preferences: updates.preferences ? { ...prev.preferences, ...updates.preferences } : prev.preferences,
      notifications: updates.notifications ? {
        ...prev.notifications,
        email: updates.notifications.email ? { ...prev.notifications.email, ...updates.notifications.email } : prev.notifications.email,
        push: updates.notifications.push ? { ...prev.notifications.push, ...updates.notifications.push } : prev.notifications.push,
        inApp: updates.notifications.inApp ? { ...prev.notifications.inApp, ...updates.notifications.inApp } : prev.notifications.inApp,
      } : prev.notifications,
      security: updates.security ? { ...prev.security, ...updates.security } : prev.security,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        leads,
        activities,
        followUps,
        notifications,
        counselors: mockUsers.filter(u => u.role === 'Counselor'),
        lastUpdated,
        settings,
        addLead,
        updateLead,
        deleteLead,
        addActivity,
        addFollowUp,
        updateFollowUp,
        deleteFollowUp,
        updateSettings,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
