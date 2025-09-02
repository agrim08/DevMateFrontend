import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

const ProfileTextAreaField = ({ icon: Icon, label, id, value, onChange, placeholder, maxLength }) => (
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

export default ProfileTextAreaField