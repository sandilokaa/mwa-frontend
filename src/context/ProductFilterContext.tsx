"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ProductFilterContextType {
    selectedProduct: string;
    setSelectedProduct: (product: string) => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | null>(null);

export function ProductFilterProvider({ children }: { children: ReactNode }) {
    const [selectedProduct, setSelectedProduct] = useState<string>("6x6 Conversion");

    return (
        <ProductFilterContext.Provider value={{ selectedProduct, setSelectedProduct }}>
            {children}
        </ProductFilterContext.Provider>
    );
}

export function useProductFilter() {
    const context = useContext(ProductFilterContext);
    if (!context) {
        throw new Error("useProductFilter must be used inside ProductFilterProvider");
    }
    return context;
}
