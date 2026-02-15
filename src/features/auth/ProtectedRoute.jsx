import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useSelector((store) => store.user)

  // Show nothing or a loader while checking the session on refresh
  if (isLoading) {
    return null; 
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute