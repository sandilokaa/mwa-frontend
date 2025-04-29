import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RnE Dashboard",
  description: "Welcome to the Merpati Wahana Raya Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
          <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
