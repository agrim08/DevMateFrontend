import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./index.css"
import Login from "./components/Login"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/store"
import Feed from "./components/Feed"
import Body from "./components/Body"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import Premium from "./components/Premium"
import Chat from "./components/Chat"
import CompleteProfile from "./components/CompleteProfile"
import Landing from "./components/Landing"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthRoute from "./components/AuthRoute"
import VerifyEmail from "./components/VerifyEmail"
import axios from "axios"
import { BASE_URL } from "./utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addUser, removeUser } from "./utils/userSlice"
import { useEffect } from "react"

function App() {
  return (
    <Provider store={appStore}>
      <AppContent />
    </Provider>
  )
}

function AppContent() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        })
        dispatch(addUser(res.data.data))
      } catch (error) {
        dispatch(removeUser())
      }
    }
    fetchUser()
  }, [dispatch])

  return (
    <BrowserRouter basename="/">
      <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Auth-only routes (login/signup) */}
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/verify-email" element={<VerifyEmail />} />


          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="premium" element={<Premium />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:targetUserId" element={<Chat />} />
              <Route path="complete-profile" element={<CompleteProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
