
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/uiComponents/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer, toast } from 'react-toastify';



export const metadata: Metadata = {
  title: "Notes App",
  description: "A smart notes app for all your need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
    <TooltipProvider>
        {children}
    </TooltipProvider>
        <ToastContainer />


      </body>
    </html>
  );
}
