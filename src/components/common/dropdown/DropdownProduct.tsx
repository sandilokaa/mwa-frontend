"use client";

import { useState } from "react";
import Image from "next/image";
import { useProductFilter } from "@/context/ProductFilterContext";

interface DropdownProductProps {
    options: string[];
}

export default function DropdownProduct({ options }: DropdownProductProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { selectedProduct, setSelectedProduct } = useProductFilter(); 



    const handleSelect = (option: string) => {
        setIsOpen(false);
        setSelectedProduct(option)
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#EFEFEF] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer w-full h-[45px]"
                >
                    <div className="flex justify-between items-center gap-2">
                        <p className="text-sm text-black">
                            {selectedProduct}
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
