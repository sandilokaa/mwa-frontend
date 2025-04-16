"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/footer/Footer";
import { ProductFilterProvider } from "@/context/ProductFilterContext";
import { store } from "@/store/store";
import AuthInit from "../common/auth/AuthInit";
import { ClipLoader } from "react-spinners";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);

        return () => clearTimeout(timeout);
    }, [pathname])

    return (
        <SnackbarProvider 
            maxSnack={1}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
        >
            <Provider store={store}>
                {isAuthPage ? (
                    <div className="h-screen flex">{children}</div>
                ) : (
                    <ProductFilterProvider>
                        <AuthInit/>
                        <div className="flex h-screen overflow-hidden">
                            <Sidebar />
                            <div className="flex-1 flex flex-col">
                                <Navbar />
                                {loading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <ClipLoader size={30} color="#144C68" />
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-auto p-5">{children}</div>
                                )}
                                <Footer />
                            </div>
                        </div>
                    </ProductFilterProvider>
                )}
            </Provider>
        </SnackbarProvider>
    );
}