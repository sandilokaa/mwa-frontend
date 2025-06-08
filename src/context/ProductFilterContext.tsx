'use client'

import { createContext, useContext, useState } from "react";

interface Product {
    id: number;
    name: string;
}

interface ProductFilterContextType {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product) => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export const ProductFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <ProductFilterContext.Provider value={{ selectedProduct, setSelectedProduct }}>
            {children}
        </ProductFilterContext.Provider>
    );
};

export const useProductFilter = () => {
    const context = useContext(ProductFilterContext);
    if (!context) {
        throw new Error("useProductFilter must be used within a ProductFilterProvider");
    }
    return context;
};
