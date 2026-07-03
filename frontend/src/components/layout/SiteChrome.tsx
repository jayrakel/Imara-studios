"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatBookButton from "./FloatBookButton";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAppLayout = pathname?.startsWith("/admin") || pathname?.startsWith("/choir/member-portal");

    if (isAppLayout) return <>{children}</>;


    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatBookButton />
        </>
    );
}