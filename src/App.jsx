import { RouterProvider } from "react-router-dom"
import "./index.css"
import { Toaster } from "sonner"
import { router } from "./routes"
import { useDispatch } from "react-redux"
import { addUser, removeUser, setLoading as setUserLoading } from "./store/slices/userSlice"
import { useEffect } from "react"
import axiosInstance from "./api/axiosInstance"
import LoadingBar from "./components/common/LoadingBar"

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        dispatch(setUserLoading(true));
        const res = await axiosInstance.get("/profile/view", {
          showLoader: false // Don't show global loader for silent session check
        })
        if (isMounted) {
          dispatch(addUser(res.data.data))
        }
      } catch (error) {
        if (isMounted) {
          dispatch(removeUser())
        }
      } finally {
        if (isMounted) {
          dispatch(setUserLoading(false));
        }
      }
    }
    fetchUser()
    return () => {
      isMounted = false;
    }
  }, [dispatch])

  return (
    <>
      <LoadingBar />
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
