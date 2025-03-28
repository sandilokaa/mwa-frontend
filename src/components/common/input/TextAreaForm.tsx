import React, { forwardRef } from "react";

interface TextAreaFormProps {
    label: string;
    placeholder?: string;
    rows?: number;
}

const TextAreaForm = forwardRef<HTMLTextAreaElement, TextAreaFormProps>(
    ({ label, placeholder, rows = 3 }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{label}</label>
                <textarea
                    ref={ref}
                    placeholder={placeholder}
                    rows={rows}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-sm"
                />
            </div>
        );
    }
);

TextAreaForm.displayName = "TextAreaForm";

export default TextAreaForm;
