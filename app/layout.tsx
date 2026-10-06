import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "DataScout — Find your next data deal", description: "Compare Nigerian data reseller plans side by side." };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
