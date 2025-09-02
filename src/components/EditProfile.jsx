import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { toast } from "sonner"
import { User, Mail, Calendar, Info, Image as ImageIcon, Users, Save, Eye, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import UserCard from "./UserCard"
import ProfileInputField from "./ProfileInputField"
import ProfileTextAreaField from "./ProfileTextAreaField"
import SkillsInput from "./SkillsInput"

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
      setSkills(Array.isArray(user.skills) ? user.skills : user.skills.split(",").map((s) => s.trim()))
    }
  }, [user?.skills])

  const [previewUser, setPreviewUser] = useState({
    firstName,
    lastName,
    userAge: userAge ? Number.parseInt(userAge) : user?.userAge,
    bio,
    skills: skills.join(", "),
    photoUrl,
    gender,
  })

  useEffect(() => {
    setPreviewUser({
      ...user,
      firstName,
      lastName,
      userAge: userAge ? Number.parseInt(userAge) : user?.userAge,
      gender,
      bio,
      skills: skills.join(", "),
      photoUrl,
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
    if (!validateInputs()) return

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

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Form Section */}
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
        <form onSubmit={updateProfile} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInputField
              icon={User}
              label="First Name"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. John"
            />
            <ProfileInputField
              icon={User}
              label="Last Name"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInputField
              icon={Calendar}
              label="Age"
              id="userAge"
              type="number"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              placeholder="e.g. 25"
            />
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                Gender
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-11 pl-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <ProfileTextAreaField
            icon={Info}
            label="Bio"
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength={300}
          />

          <ProfileInputField
            icon={ImageIcon}
            label="Photo URL"
            id="photoUrl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
          />

          <SkillsInput skills={skills} setSkills={setSkills} label="Skills" id="skills" />

          {errors && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{errors}</p>}

          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
        </div>
        <div className="sticky top-24">
          <UserCard user={previewUser} isPreview={true} />
        </div>
      </div>
    </div>
  )
}

export default EditProfile
