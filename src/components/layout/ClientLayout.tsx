"use client";

import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/footer/Footer";
import { ProductFilterProvider } from "@/context/ProductFilterContext";
import { store } from "@/store/store";
import AuthInit from "../common/auth/AuthInit";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login");

    return (
        <SnackbarProvider 
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Provider store={store}>
                {isAuthPage ? (
                    <div className="h-screen flex">{children}</div>
                ) : (
                    <ProductFilterProvider>
                        <AuthInit/>
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
        </SnackbarProvider>
    );
}