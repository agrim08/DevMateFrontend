import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const VerifyEmail = () => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const emailId = state?.emailId

  const verifyOTP = async () => {
    try {
      setLoading(true)
      const res = await axios.post(
        `${BASE_URL}/verify-email`,
        { emailId, otp },
        { withCredentials: true }
      )

      dispatch(addUser(res.data.user))
      navigate("/app")
    } catch (err) {
      setError(err.response?.data || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  if (!emailId) return <p>Invalid access</p>

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-80">
        <h2 className="text-xl font-semibold text-center">
          Verify your email
        </h2>

        <Input
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={verifyOTP} disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  )
}

export default VerifyEmail
