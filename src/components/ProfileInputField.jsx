import { Label } from "./ui/label"
import { Input } from "./ui/input"

const ProfileInputField = ({ icon: Icon, label, id, value, onChange, type = "text", placeholder, maxLength }) => (
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

export default ProfileInputField