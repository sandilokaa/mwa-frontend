import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFormProps {
    label: string;
    type?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputForm = forwardRef<HTMLInputElement, InputFormProps>(({ label, type = "text", placeholder, onChange }, ref) => {

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <div className="relative">
                <input
                    ref={ref}
                    type={inputType}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-sm h-[45px] text-sm"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
});

InputForm.displayName = "InputForm";

export default InputForm;
