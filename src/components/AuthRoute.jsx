import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AuthRoute = () => {
  const user = useSelector((store) => store.user)

  // Already logged in → dashboard
  if (user) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}

export default AuthRoute