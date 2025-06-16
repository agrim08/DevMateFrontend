"use client"

import { useState, useEffect } from "react"
import UserCard from "./UserCard"
import { useDispatch } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { User, AtSign, Calendar, Users, Briefcase, LinkIcon, Loader2, Save, ArrowLeft, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import toast from "react-hot-toast"

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [userAge, setUserAge] = useState(user?.userAge?.toString() || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [skills, setSkills] = useState([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.skills) {
      const skillsArray =
        typeof user.skills === "string"
          ? user.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : Array.isArray(user.skills)
            ? user.skills
            : []
      setSkills(skillsArray)
    }
  }, [user?.skills])

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const [previewUser, setPreviewUser] = useState({
    firstName,
    lastName,
    userAge: userAge ? Number.parseInt(userAge) : user?.userAge,
    bio,
    skills: skills.join(", "),
    photoUrl,
    gender,
  })

  // Update preview user whenever form fields change
  useEffect(() => {
    setPreviewUser({
      firstName: firstName || user?.firstName,
      lastName: lastName || user?.lastName,
      userAge: userAge ? Number.parseInt(userAge) : user?.userAge,
      bio: bio || user?.bio,
      skills: skills.join(", "),
      photoUrl: photoUrl || user?.photoUrl,
      gender: gender || user?.gender,
    })
  }, [firstName, lastName, userAge, gender, bio, skills, photoUrl, user])

  const validateInputs = () => {
    let validationErrors = ""
    if (userAge && (isNaN(Number.parseInt(userAge)) || Number.parseInt(userAge) < 1)) {
      validationErrors += "Please enter a valid age.\n"
    }
    if (bio && (bio.length < 20 || bio.length > 150)) {
      validationErrors += "Bio must be between 20 and 150 characters.\n"
    }
    if (photoUrl && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(photoUrl)) {
      validationErrors += "Please provide a valid URL for the photo.\n"
    }
    setErrors(validationErrors.trim())
    return validationErrors === ""
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setErrors("")

    if (!validateInputs()) {
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.put(
        `${BASE_URL}/profile/edit`,
        {
          userAge: userAge ? Number.parseInt(userAge) : undefined,
          bio,
          skills: skills.join(", "),
          photoUrl,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      )
      dispatch(addUser(res?.data?.data))
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile!")
      setErrors(error.response?.data?.message || "Failed to update profile!")
    } finally {
      setIsLoading(false)
    }
  }

  const InputField = ({ icon: Icon, label, id, value, onChange, type = "text", placeholder, maxLength }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
        {maxLength && (
          <span className="text-xs text-gray-500 ml-2">
            ({value?.length || 0}/{maxLength})
          </span>
        )}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type={type}
          id={id}
          className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
        />
      </div>
    </div>
  )

  const TextAreaField = ({ icon: Icon, label, id, value, onChange, placeholder, maxLength }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
        {maxLength && (
          <span className="text-xs text-gray-500 ml-2">
            ({value?.length || 0}/{maxLength})
          </span>
        )}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Textarea
          id={id}
          className="min-h-[100px] pl-11 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/app")} className="mb-4 hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your information and see how it looks to others</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <User className="h-6 w-6 text-blue-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    icon={User}
                    label="First Name"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    maxLength={50}
                  />
                  <InputField
                    icon={User}
                    label="Last Name"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    maxLength={50}
                  />
                </div>

                <TextAreaField
                  icon={AtSign}
                  label="Bio"
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  maxLength={150}
                />

                {/* Skills Section with Chips */}
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">
                    Skills
                    <span className="text-xs text-gray-500 ml-2">({skills.length} skills)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="skills"
                      name="skills"
                      placeholder="Type a skill and press Enter"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                      className="h-11 pl-11 pr-20 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Button
                      type="button"
                      onClick={addSkill}
                      disabled={!currentSkill.trim()}
                      className="absolute right-1 top-1 h-9 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Skills Display */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 pr-1"
                        >
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-blue-300 rounded-full"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    icon={Calendar}
                    label="Age"
                    id="age"
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    placeholder="Enter your age"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                      Gender
                    </Label>
                    <div className="relative">
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <InputField
                  icon={LinkIcon}
                  label="Photo URL"
                  id="photoUrl"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                />

                {errors && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700 text-sm whitespace-pre-line">{errors}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Live Preview</h3>
            <UserCard user={previewUser} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
