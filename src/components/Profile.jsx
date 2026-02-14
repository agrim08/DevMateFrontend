import { useSelector } from "react-redux"
import EditProfile from "./EditProfile"

const Profile = () => {
  const { data: user } = useSelector((store) => store.user)
  return user && <EditProfile user={user} />
}

export default Profile
