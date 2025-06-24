"use client"

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Product {
    id: number;
    name: string;
}

interface DropdownProductProps {
    label: string;
    options: Product[];
    onSelect: (product: Product) => void;
    defaultValue?: number;
}

export default function DropdownProductForm({
    label,
    options,
    onSelect,
    defaultValue
}: DropdownProductProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (defaultValue && options.length > 0) {
            const found = options.find(p => p.id === defaultValue);
            if (found) setSelected(found);
        }
    }, [defaultValue, options]);

    // Auto-close on outside click
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

    const handleSelect = (product: Product) => {
        setSelected(product);
        onSelect(product);
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
                            {selected?.name || "Select a product"}
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
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2 max-h-[160px] overflow-y-auto">
                    {options.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-sm text-sm"
                        >
                            {product.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
