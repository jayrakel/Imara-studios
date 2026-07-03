"use client";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default function FloatBookButton() {
  return (
    <div className="float-book-btn">
      <Link href="/contact" id="float-book-btn" className="btn btn-gold btn-lg"
        style={{ borderRadius: "100px", boxShadow: "0 8px 32px rgba(201,168,76,0.4)", gap: "0.5rem" }}>
        <CalendarCheck size={18} />
        Book Now
      </Link>
    </div>
  );
}
