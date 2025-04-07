"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/footer/Footer";
import { ProductFilterProvider } from "@/context/ProductFilterContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login");

    if (isAuthPage) {
        return <div className="h-screen flex">{children}</div>;
    }

    return (
        <ProductFilterProvider>
            <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                <div className="flex-1 flex flex-col h-screen">
                    <Navbar />
                <div className="flex-1 overflow-auto p-5">{children}</div>
                    <Footer />
                </div>
            </div>
        </ProductFilterProvider>
    );
}