'use client'

import React, { forwardRef, useState, useEffect } from "react";

interface DateInputFormProps {
    label: string;
    defaultValue?: string;
}

const DateInputForm = forwardRef<HTMLInputElement, DateInputFormProps>(({ label, defaultValue }, ref) => {
    const [isSelected, setIsSelected] = useState(!!defaultValue);

    useEffect(() => {
        if (defaultValue) {
            setIsSelected(true);
        }
    }, [defaultValue]);

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                type="date"
                ref={ref}
                defaultValue={defaultValue}
                onChange={(e) => setIsSelected(!!e.target.value)} 
                className={`border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm h-[45px] cursor-pointer
                ${isSelected ? "text-black" : "text-[#989898]"}`}
            />
        </div>
    );
});


DateInputForm.displayName = "DateInputForm";

export default DateInputForm;
