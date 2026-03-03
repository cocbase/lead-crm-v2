import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const BASE_PATH = "/make-server-38b9ad34";

// Middleware to check auth
const authMiddleware = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
  
  c.set('user', user);
  await next();
};

// Seed initial data if none exists
const seedLeads = async () => {
  const existingLeads = await kv.getByPrefix("lead:");
  if (existingLeads.length < 5) {
    const initialLeads = [
      { id: "L-1024", name: "Alice Johnson", email: "alice.j@example.com", phone: "+1 234 567 8901", course: "Computer Science", status: "Interested", counselor: "Sarah J.", followUp: "Today, 2:30 PM", color: "info", days: 3 },
      { id: "L-1025", name: "David Smith", email: "d.smith@university.edu", phone: "+1 234 567 8902", course: "MBA", status: "Contacted", counselor: "Mike R.", followUp: "Tomorrow, 10:00 AM", color: "warning", days: 5 },
      { id: "L-1026", name: "Maria Garcia", email: "mgarcia@gmail.com", phone: "+1 234 567 8903", course: "Design", status: "New", counselor: "John D.", followUp: "Feb 20, 11:15 AM", color: "default", days: 1 },
      { id: "L-1027", name: "Robert Brown", email: "rbrown@yahoo.com", phone: "+1 234 567 8904", course: "Economics", status: "Enrolled", counselor: "Emily B.", followUp: "Completed", color: "success", days: 12 },
      { id: "L-1028", name: "Sophia Wilson", email: "sophia.w@outlook.com", phone: "+1 234 567 8905", course: "Law", status: "Lost", counselor: "Sarah J.", followUp: "No date", color: "error", days: 8 },
      { id: "L-1029", name: "James Taylor", email: "jtaylor@mail.com", phone: "+1 234 567 8906", course: "Psychology", status: "Interested", counselor: "Mike R.", followUp: "Feb 21, 04:00 PM", color: "info", days: 4 },
      { id: "L-1030", name: "Linda Moore", email: "l.moore@college.edu", phone: "+1 234 567 8907", course: "History", status: "Contacted", counselor: "John D.", followUp: "Today, 05:30 PM", color: "warning", days: 6 },
      { id: "L-1031", name: "Michael Lee", email: "m.lee@webmail.com", phone: "+1 234 567 8908", course: "Physics", status: "New", counselor: "Emily B.", followUp: "Feb 22, 09:30 AM", color: "default", days: 2 },
      { id: "L-1032", name: "Emma Watson", email: "emma.w@example.com", phone: "+1 234 567 8909", course: "Computer Science", status: "Contacted", counselor: "Sarah J.", followUp: "Today, 11:00 AM", color: "warning", days: 7 },
      { id: "L-1033", name: "Chris Evans", email: "c.evans@avengers.com", phone: "+1 234 567 8910", course: "Design", status: "Interested", counselor: "Mike R.", followUp: "Tomorrow, 02:00 PM", color: "info", days: 2 },
      { id: "L-1034", name: "Scarlett Johans", email: "scarlett@mail.com", phone: "+1 234 567 8911", course: "Business", status: "New", counselor: "John D.", followUp: "Today, 04:15 PM", color: "default", days: 1 },
      { id: "L-1035", name: "Tom Holland", email: "tom.h@spidey.com", phone: "+1 234 567 8912", course: "Engineering", status: "Interested", counselor: "Emily B.", followUp: "Feb 23, 10:00 AM", color: "info", days: 3 },
      { id: "L-1036", name: "Elizabeth Olsen", email: "eo@wandavision.com", phone: "+1 234 567 8913", course: "Arts", status: "Enrolled", counselor: "Sarah J.", followUp: "Completed", color: "success", days: 15 },
      { id: "L-1037", name: "Benedict Cumber", email: "bc@strange.com", phone: "+1 234 567 8914", course: "Medicine", status: "Lost", counselor: "Mike R.", followUp: "No date", color: "error", days: 10 },
      { id: "L-1038", name: "Paul Rudd", email: "pr@antman.com", phone: "+1 234 567 8915", course: "MBA", status: "Contacted", counselor: "John D.", followUp: "Today, 03:00 PM", color: "warning", days: 4 },
    ];
    for (const lead of initialLeads) {
      await kv.set(`lead:${lead.id}`, lead);
    }
  }
};

seedLeads();

// Health check endpoint
app.get(`${BASE_PATH}/health`, (c) => {
  return c.json({ status: "ok" });
});

// Auth Routes
app.post(`${BASE_PATH}/signup`, async (c) => {
  const { email, password, name, role } = await c.req.json();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name, role },
    email_confirm: true
  });
  
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ user: data.user });
});

// Leads API
app.get(`${BASE_PATH}/leads`, async (c) => {
  const leads = await kv.getByPrefix("lead:");
  return c.json(leads);
});

app.get(`${BASE_PATH}/leads/:id`, async (c) => {
  const id = c.req.param('id');
  const lead = await kv.get(`lead:${id}`);
  if (!lead) return c.json({ error: "Lead not found" }, 404);
  return c.json(lead);
});

app.post(`${BASE_PATH}/leads`, async (c) => {
  const lead = await c.req.json();
  const id = lead.id || `L-${Math.floor(Math.random() * 9000) + 1000}`;
  const newLead = { ...lead, id };
  await kv.set(`lead:${id}`, newLead);
  return c.json(newLead);
});

app.put(`${BASE_PATH}/leads/:id`, async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const existing = await kv.get(`lead:${id}`);
  if (!existing) return c.json({ error: "Lead not found" }, 404);
  
  const updatedLead = { ...existing, ...updates };
  await kv.set(`lead:${id}`, updatedLead);
  return c.json(updatedLead);
});

app.delete(`${BASE_PATH}/leads/:id`, async (c) => {
  const id = c.req.param('id');
  await kv.del(`lead:${id}`);
  return c.json({ success: true });
});

app.get(`${BASE_PATH}/stats`, async (c) => {
  const leads = await kv.getByPrefix("lead:");
  const totalLeads = leads.length;
  const newLeads = leads.filter((l: any) => l.status === "New").length;
  const contactedLeads = leads.filter((l: any) => l.status === "Contacted").length;
  const enrolledLeads = leads.filter((l: any) => l.status === "Enrolled").length;
  
  // Calculate conversion rate
  const conversionRate = totalLeads > 0 ? (enrolledLeads / totalLeads * 100).toFixed(1) : 0;

  return c.json({
    totalLeads,
    newLeads,
    contactedLeads,
    enrolledLeads,
    conversionRate
  });
});

// Pipeline/Tasks API (Mock or use separate prefix)
app.get(`${BASE_PATH}/pipeline`, async (c) => {
  const leads = await kv.getByPrefix("lead:");
  // Group leads by status for pipeline
  const pipeline = {
    "New": leads.filter((l: any) => l.status === "New"),
    "Contacted": leads.filter((l: any) => l.status === "Contacted"),
    "Interested": leads.filter((l: any) => l.status === "Interested"),
    "Enrolled": leads.filter((l: any) => l.status === "Enrolled"),
  };
  return c.json(pipeline);
});

Deno.serve(app.fetch);
