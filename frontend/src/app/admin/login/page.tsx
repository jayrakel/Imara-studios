"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Invalid credentials");
      }
      const data = await res.json();

      // Check role — only staff can access admin
      const allowedRoles = ["SUPER_ADMIN", "STUDIO_ENGINEER", "CHOIR_DIRECTOR"];
      if (!allowedRoles.includes(data.user.role)) {
        throw new Error("You do not have admin access.");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--charcoal-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: "1rem" }}>
            <Shield size={28} color="var(--gold)" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em" }}>IMARA ADMIN</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.375rem" }}>Secure Dashboard Access</p>
        </div>

        <form onSubmit={handleLogin} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label className="form-label" htmlFor="admin-email">Email Address</label>
            <input id="admin-email" type="email" className="input" placeholder="admin@imarastudios.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div style={{ position: "relative" }}>
              <input id="admin-password" type={showPass ? "text" : "password"} className="input"
                placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password" style={{ paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem" }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button id="admin-login-btn" type="submit" className="btn btn-gold" disabled={loading}
            style={{ justifyContent: "center", marginTop: "0.5rem" }}>
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem", marginTop: "1.5rem" }}>
          🔒 This area is restricted to authorised staff only.<br />
          Access attempts are logged.
        </p>
      </div>
    </div>
  );
}
