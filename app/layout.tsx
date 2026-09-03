import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Seekly — Find anything in your business", description: "Search Gmail, Drive and company knowledge from one simple place." };

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }