import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../features/auth/Login";
import VerifyEmailPage from "../features/auth/VerifyEmail";
import FeedPage from "../features/feed/Feed";
import ProfilePage from "../features/profile/Profile";
import ConnectionsPage from "../features/connections/Connections";
import RequestsPage from "../features/connections/Requests";
import PremiumPage from "../features/premium/Premium";
import ChatPage from "../features/chat/Chat";
import CompleteProfilePage from "../features/profile/CompleteProfile";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import AuthRoute from "../features/auth/AuthRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    element: <AuthRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/app",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "connections",
        element: <ConnectionsPage />,
      },
      {
        path: "requests",
        element: <RequestsPage />,
      },
      {
        path: "premium",
        element: <PremiumPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "chat/:targetUserId",
        element: <ChatPage />,
      },
      {
        path: "complete-profile",
        element: <CompleteProfilePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
