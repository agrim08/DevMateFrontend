import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

const ProfileTextAreaField = ({ icon: Icon, label, id, value, onChange, placeholder, maxLength }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-center px-1">
      <Label htmlFor={id} className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </Label>
      {maxLength && (
        <span className="text-[10px] font-bold text-muted-foreground/30 tabular-nums">
          {value?.length || 0} / {maxLength}
        </span>
      )}
    </div>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-4 flex items-center justify-center pointer-events-none">
          <Icon className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-300" />
        </div>
      )}
      <Textarea
        id={id}
        className={`min-h-[140px] ${Icon ? 'pl-12' : 'pl-4'} pr-6 py-4 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-medium placeholder:text-muted-foreground/20 text-sm resize-none leading-relaxed shadow-inner`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
      <div className="absolute inset-0 rounded-2xl border border-primary/0 group-focus-within:border-primary/20 pointer-events-none transition-colors duration-500" />
    </div>
  </div>
)

export default ProfileTextAreaField