import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const ProfileInputField = ({ icon: Icon, label, id, value, onChange, type = "text", placeholder, maxLength, disabled = false }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-center px-1">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground tracking-wide">
        {label}
      </Label>
      {maxLength && (
        <span className="text-[10px] font-medium text-muted-foreground/50 tabular-nums">
          {value?.length || 0} / {maxLength}
        </span>
      )}
    </div>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <Icon className="w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors duration-200" />
        </div>
      )}
      <input
        type={type}
        id={id}
        disabled={disabled}
        className={`w-full h-11 ${Icon ? 'pl-11' : 'pl-4'} pr-4 rounded-xl bg-secondary/30 border border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-medium placeholder:text-muted-foreground/30 text-sm outline-none`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
      <div className="absolute inset-0 rounded-2xl border border-primary/0 group-focus-within:border-primary/20 pointer-events-none transition-colors duration-500" />
    </div>
  </div>
)

export default ProfileInputField