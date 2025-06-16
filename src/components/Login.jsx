import { useState } from "react"
import { Eye, EyeOff, Mail, Heart } from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginForm, setIsLoginForm] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateInputs = () => {
    let validationError = ""
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailId.trim()) {
      validationError += "Email is required.\n"
    } else if (!emailRegex.test(emailId)) {
      validationError += "Enter a valid email.\n"
    }

    if (!password.trim()) {
      validationError += "Password is required.\n"
    } else if (password.length < 8) {
      validationError += "Password must be at least 8 characters.\n"
    }

    if (!isLoginForm) {
      if (!firstName.trim()) {
        validationError += "First name is required.\n"
      } else if (firstName.length < 3 || firstName.length > 10) {
        validationError += "First name must be 3-10 characters.\n"
      }
      if (lastName && (lastName.length < 3 || lastName.length > 15)) {
        validationError += "Last name must be 3-15 characters.\n"
      }
    }

    setErrors(validationError.trim())
    return validationError === ""
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors("")
    if (!validateInputs()) return

    try {
      setIsLoading(true)
      const res = await axios.post(`${BASE_URL}/login`, { emailId, password }, { withCredentials: true })
      dispatch(addUser(res.data))
      setIsLoading(false)
      navigate("/app")
    } catch (error) {
      setIsLoading(false)
      setErrors(error.response?.data?.message || "Login failed")
      console.error("Login failed:", error.message)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrors("")
    if (!validateInputs()) return

    try {
      setIsLoading(true)
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { emailId, password, firstName, lastName },
        { withCredentials: true },
      )
      dispatch(addUser(res.data))
      setIsLoading(false)
      setEmailId("")
      setFirstName("")
      setLastName("")
      setPassword("")
      navigate("/app/complete-profile")
    } catch (error) {
      setIsLoading(false)
      setErrors(error.response?.data?.message || "Signup failed")
      console.error("Signup failed:", error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DevMate</h1>
          <p className="text-gray-600">Connect with developers worldwide</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLoginForm ? "Welcome back" : "Join DevMate"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLoginForm
                ? "Sign in to connect with your developer community"
                : "Create your account and start building connections"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={isLoginForm ? handleLogin : handleSignUp} className="space-y-5">
              {!isLoginForm && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {errors && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 text-sm whitespace-pre-line">{errors}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold text-white shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : isLoginForm ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
              disabled
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{isLoginForm ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
              </div>
            </Button>

            <div className="text-center text-sm text-gray-600">
              {isLoginForm ? (
                <>
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    onClick={() => {
                      setIsLoginForm(false)
                      setErrors("")
                    }}
                  >
                    Sign up for free
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    onClick={() => {
                      setIsLoginForm(true)
                      setErrors("")
                    }}
                  >
                    Sign in
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login
