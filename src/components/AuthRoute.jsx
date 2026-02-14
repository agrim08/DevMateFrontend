import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AuthRoute = () => {
  const { data: user, isLoading } = useSelector((store) => store.user)

  if (isLoading) return null

  // Already logged in → dashboard
  if (user) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}

export default AuthRoute