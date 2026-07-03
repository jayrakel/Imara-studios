"use client";
import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = Omit<ImageProps, "src"> & { imageKey: string; fallbackSrc: string };

/**
 * Drop-in replacement for next/image that pulls its URL from the
 * admin-managed SiteImage table, falling back to a static default
 * if the API call fails or the key hasn't been set yet.
 */
export default function SiteImage({ imageKey, fallbackSrc, ...rest }: Props) {
    const [src, setSrc] = useState(fallbackSrc);

    useEffect(() => {
        let cancelled = false;
        fetch(`${API}/api/media/images/${imageKey}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && data?.url) setSrc(data.url);
            })
            .catch(() => { });
        return () => { cancelled = true; };
    }, [imageKey]);

    return <Image src={src} unoptimized={src.startsWith("http")} {...rest} />;
}