import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { LeadsList } from "./pages/LeadsList";
import { LeadProfile } from "./pages/LeadProfile";
import { Pipeline } from "./pages/Pipeline";
import { FollowUps } from "./pages/FollowUps";
import { Reports } from "./pages/Reports";
import { UserManagement } from "./pages/UserManagement";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/",
    Component: DashboardLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: Dashboard },
      { path: "leads", Component: LeadsList },
      { path: "leads/:id", Component: LeadProfile },
      { path: "pipeline", Component: Pipeline },
      { path: "follow-ups", Component: FollowUps },
      { path: "reports", Component: Reports },
      { path: "users", Component: UserManagement },
      { path: "settings", Component: Settings },
    ],
  },
]);
