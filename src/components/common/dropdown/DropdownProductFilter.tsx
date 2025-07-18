"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useProductFilter } from "@/context/ProductFilterContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { fetchProducts } from "@/store/slice/product/getAllSlice";

interface Product {
    id: number;
    name: string;
}

export default function DropdownProduct() {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { selectedProduct, setSelectedProduct } = useProductFilter(); 
    const { products } = useAppSelector((state: RootState) => state.productList);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        if (products.length > 0 && !selectedProduct) {
            const defaultProduct = products[0];
            setSelectedProduct(defaultProduct);
        }
    }, [products, selectedProduct, setSelectedProduct]);

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
        setIsOpen(false);
        setSelectedProduct(product);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block text-left w-[620px]">
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    // className="bg-[#EFEFEF] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer w-full h-[45px]"
                    className="rounded-sm px-3 py-2 cursor-pointer w-full h-[45px] flex justify-center items-center"
                >
                    <div className="flex justify-between items-center gap-3">
                        <p className="text-[#144C68] font-bold tracking-wider text-[32px]">
                            {selectedProduct ? selectedProduct.name.toUpperCase() : "Select Product"}
                        </p>
                        <Image
                            className="-rotate-90"
                            src="/images/icon/chevron-down.svg"
                            alt="Arrow Icon"
                            height={28}
                            width={28}
                        />
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2 overflow-y-auto max-h-[160px]">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            // className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-sm font-medium tracking-wider"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-sm font-bold tracking-wider text-[#144C68]"
                        >
                            {product.name.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
