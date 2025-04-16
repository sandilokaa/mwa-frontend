"use client";

import { useState, useEffect } from "react";
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
    const { selectedProduct, setSelectedProduct } = useProductFilter(); 
    const { products } = useAppSelector((state: RootState) => state.productList);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    
        if (!selectedProduct) {
            const defaultProduct = products.find(product => product.name === "6x6 Conversion");
            if (defaultProduct) {
                setSelectedProduct(defaultProduct);
            }
        }
    }, [dispatch, selectedProduct, products, setSelectedProduct]);
    

    const handleSelect = (product: Product) => {
        setIsOpen(false);
        setSelectedProduct(product);
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#EFEFEF] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer w-[160px] h-[45px]"
                >
                    <div className="flex justify-between items-center gap-2">
                        <p className="text-sm text-black">
                            {selectedProduct ? selectedProduct.name : "Select Product"}
                        </p>
                        <Image className="-rotate-90" src="/images/icon/chevron-down.svg" alt="Arrow Icon" height={24} width={24}/>
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2">
                    {products.map((product) => (
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
