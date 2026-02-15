import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AuthRoute = ({ children }) => {
  const { data: user, isLoading } = useSelector((store) => store.user)

  if (isLoading) return null

  // Already logged in → dashboard
  if (user) {
    return <Navigate to="/app" replace />
  }

  return children ? children : <Outlet />
}

export default AuthRoute