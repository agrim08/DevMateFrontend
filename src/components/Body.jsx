import { useEffect } from "react"
import Navbar from "./Navbar"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Footer from "./Footer"
import { BASE_URL } from "../utils/constants"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"

const Body = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector((store) => store.user)

  const getUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      })
      dispatch(addUser(res.data))
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login")
      }
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (!user) {
      getUser()
    }
  }, [user])

  useEffect(() => {
    if (
      user &&
      !user.isProfileComplete &&
      location.pathname !== "/app/complete-profile" &&
      location.pathname !== "/login"
    ) {
      navigate("/app/complete-profile")
    }
  }, [user, navigate, location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body