import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Welth - Your Wealth Manager",
  description: "wealth management platform",
};

// importing custom font
const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* header */}
          <Header />

          <main className="min-h-screen container mx-auto px-2">
            {children}
          </main>

          <Toaster richColors/>

          {/* footer */}
          <footer className="bg-blue-50 py-12">
            <div className="container px-4 text-center text-gray-600 mx-auto">
              Designed with Next.js
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
