import { cn } from "@/lib/utils";

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function BrutalInput({
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  className,
  required,
  defaultValue,
  ...props
}: BrutalInputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      defaultValue={defaultValue}
      className={cn(
        "w-full px-4 py-3 font-sans text-sm",
        "border-brutal border-3 border-brutal-black",
        "bg-cream text-brutal-black",
        "placeholder:text-brutal-black/40",
        "focus:outline-none focus:ring-0",
        "focus:border-accent focus:border-3",
        "transition-colors duration-100",
        className
      )}
      {...props}
    />
  );
}