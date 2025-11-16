import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "LifeMap",
  description: "NDIS planning assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 
          AuthProvider MUST wrap the entire client-side app.
          
        */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
