import React, { forwardRef } from "react";

interface InputFormProps {
    label: string;
    type?: string;
    placeholder?: string;
}

const InputForm = forwardRef<HTMLInputElement, InputFormProps>(({ label, type = "text", placeholder }, ref) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-sm h-[45px]"
            />
        </div>
    );
});

InputForm.displayName = "InputForm";

export default InputForm;
