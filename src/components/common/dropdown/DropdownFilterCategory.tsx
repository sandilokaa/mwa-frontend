"use client";

import { useState } from "react";
import Image from "next/image";

interface DropdownCategoryProps {
    options: string[];
    onSelect: (value: string) => void;
}

export default function DropdownCategory({ options, onSelect }: DropdownCategoryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Overall");

    const handleSelect = (option: string) => {
        setSelected(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer w-[150px] h-[45px]"
                >
                    <div className="flex justify-between items-center gap-2">
                        <p className={`text-sm ${selected ? "text-black" : "text-[#989898]"}`}>
                            {selected || "Select an option"}
                        </p>
                        <Image className="-rotate-90" src="/images/icon/chevron-down.svg" alt="Arrow Icon" height={24} width={24}/>
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(option)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-sm text-sm"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
