"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface DropdownStringProps {
    label: string;
    options: string[];
    onSelect: (value: string) => void;
    defaultValue?: string;
}

export default function DropdownString({
    label,
    options,
    onSelect,
    defaultValue,
}: DropdownStringProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (defaultValue && options.length > 0) {
            const found = options.find(p => p === defaultValue);
            if (found) setSelected(found);
        }
    }, [defaultValue, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option: string) => {
        setSelected(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block text-left w-full">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">{label}</label>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer w-full h-[45px]"
                >
                    <div className="flex justify-between items-center">
                        <p className={`text-sm ${selected ? "text-black" : "text-[#989898]"}`}>
                            {selected || "Select an option"}
                        </p>
                        <Image
                            className="-rotate-90"
                            src="/images/icon/chevron-down.svg"
                            alt="Arrow Icon"
                            height={24}
                            width={24}
                        />
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
