import { useState } from "react";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateInputs = () => {
    let validationError = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailId.trim()) {
      validationError += "Email is required.\n";
    } else if (!emailRegex.test(emailId)) {
      validationError += "Enter a valid email.\n";
    }
    if (!password.trim()) {
      validationError += "Password is required.\n";
    } else if (password.length < 6) {
      validationError += "Password must be at least 6 characters.\n";
    }
    setErrors(validationError.trim());
    return validationError === "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors("");
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setIsLoading(false);
      setErrors("");
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      setErrors(error?.response?.data || "Login failed");
      console.error("Login failed:", error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors("");
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          emailId,
          password,
          firstName,
          lastName,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setIsLoading(false);
      setEmailId("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setErrors("");
      navigate("/profile");
    } catch (error) {
      setIsLoading(false);
      setErrors(error?.response?.data || "Signup failed");
      console.error("signup failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="space-y-1 text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {isLoginForm ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLoginForm
                ? "Sign in to your account to continue"
                : "Enter your details to create your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={isLoginForm ? handleLogin : handleSignUp} className="space-y-4">
              {!isLoginForm && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                    className="h-10 pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                    className="h-10 pr-10"
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
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {errors && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 text-sm whitespace-pre-line">
                    {errors}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  isLoginForm ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
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
                    className="p-0 h-auto font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => {
                      setIsLoginForm(false);
                      setErrors("");
                    }}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => {
                      setIsLoginForm(true);
                      setErrors("");
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
  );
};

export default Login;