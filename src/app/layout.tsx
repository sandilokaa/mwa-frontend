import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/footer/Footer";
import { ProductFilterProvider } from "@/context/ProductFilterContext";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Prodflow",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <ProductFilterProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar/>
            <div className="flex-1 flex flex-col h-screen">
              <Navbar />
              <div className="flex-1 overflow-auto p-5">
                {children}
              </div>
              <Footer/>
            </div>
          </div>
        </ProductFilterProvider>
      </body>
    </html>
  );
}
