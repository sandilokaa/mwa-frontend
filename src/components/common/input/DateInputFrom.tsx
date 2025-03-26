import React, { useRef, useState } from "react";

interface DateInputFormProps {
    label: string;
}

const DateInputForm: React.FC<DateInputFormProps> = ({ label }) => {
    const ref = useRef<HTMLInputElement>(null);
    const [isSelected, setIsSelected] = useState(false);

    return (
        <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{label}</label>
        <input
            type="date"
            ref={ref}
            onChange={(e) => setIsSelected(!!e.target.value)} 
            className={`border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm h-[45px] cursor-pointer
            ${isSelected ? "text-black" : "text-[#989898]"}`}
        />
        </div>
    );
};

export default DateInputForm;
