import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body>{children}</body>
        <Toaster />
      </Provider>
    </html>
  );
}
