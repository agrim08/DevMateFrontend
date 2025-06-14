import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Input } from "./ui/input"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { Textarea } from "./ui/textarea"
import { User, Calendar, Users, Briefcase, LinkIcon, Heart, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { addUser } from "../utils/userSlice"

const CompleteProfile = () => {
  const [userAge, setUserAge] = useState("")
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [gender, setGender] = useState("")
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateInputs = () => {
    let validationErrors = ""
    if (!userAge || isNaN(Number.parseInt(userAge)) || Number.parseInt(userAge) < 1) {
      validationErrors += "Please enter a valid age.\n"
    }
    if (!gender || !["male", "female", "others"].includes(gender.toLowerCase())) {
      validationErrors += "Gender must be male, female, or others.\n"
    }
    if (!bio || bio.length < 20 || bio.length > 150) {
      validationErrors += "Bio must be between 20 and 150 characters.\n"
    }
    if (!skills || !skills.trim()) {
      validationErrors += "Please provide at least one skill.\n"
    }
    if (photoUrl && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(photoUrl)) {
      validationErrors += "Please provide a valid URL for the photo.\n"
    }
    setErrors(validationErrors.trim())
    return validationErrors === ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors("")

    if (!validateInputs()) {
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post(
        `${BASE_URL}/complete-profile`,
        {
          userAge: Number.parseInt(userAge),
          bio,
          skills,
          photoUrl,
          gender: gender.toLowerCase(),
        },
        { withCredentials: true },
      )

      if (res.data && res.data.data && res.data.data.isProfileComplete) {
        dispatch(addUser(res.data.data))
        navigate("/")
      } else {
        setErrors("Failed to complete profile: Profile not marked as complete.")
      }
    } catch (error) {
      console.error("Complete profile failed:", error)
      setErrors(error.response?.data?.error || "Failed to complete profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Almost There!</h1>
          <p className="text-gray-600">Complete your profile to start connecting</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
            <CardDescription className="text-gray-600">
              Help other developers get to know you better by sharing some details about yourself.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userAge" className="text-sm font-semibold text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="userAge"
                      name="userAge"
                      type="number"
                      placeholder="e.g., 25"
                      value={userAge}
                      onChange={(e) => setUserAge(e.target.value)}
                      className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="gender"
                      name="gender"
                      type="text"
                      placeholder="male, female, others"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                  Bio <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">({bio.length}/150)</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself, your interests, and what you're passionate about... (20-150 characters)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px] pl-11 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    maxLength={150}
                  />
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">
                  Skills <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="skills"
                    name="skills"
                    placeholder="List your technical skills, programming languages, frameworks, etc. (comma-separated)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="min-h-[100px] pl-11 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoUrl" className="text-sm font-semibold text-gray-700">
                  Profile Photo URL <span className="text-gray-400">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    placeholder="https://example.com/your-photo.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    <span>Completing Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Profile</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompleteProfile
