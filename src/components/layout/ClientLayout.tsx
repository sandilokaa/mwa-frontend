"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/footer/Footer";
import { ProductFilterProvider } from "@/context/ProductFilterContext";
import { store } from "@/store/store";
import { Provider } from "react-redux";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login");

    return (
        <Provider store={store}>
            {isAuthPage ? (
                <div className="h-screen flex">{children}</div>
            ) : (
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
            )}
        </Provider>
    );
}