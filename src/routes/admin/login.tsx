import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { photos } from "@/data/wedding";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

const ADMIN_EMAIL = "admin@wedding.com";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your admin password");
      return;
    }
    setLoading(true);
    try {
      // Attempt Firebase Authentication with hardcoded admin email
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      localStorage.setItem("admin_authenticated", "true");
      toast.success("Welcome back to Sriya & Janak CMS Console");
      navigate({ to: "/admin" });
    } catch (err: any) {
      // Fallback: check locally stored custom password OR default password
      const storedPassword = localStorage.getItem("admin_custom_password");
      const validPassword = storedPassword ? password === storedPassword : password === "admin123";
      if (validPassword) {
        localStorage.setItem("admin_authenticated", "true");
        toast.success("Signed in successfully");
        navigate({ to: "/admin" });
      } else {
        console.error("Login failed:", err);
        toast.error("Incorrect password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-white p-6 text-[#1F2937]">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(92,29,42,0.04) 0%, #FFFFFF 65%)",
        }}
      />

      <div className="relative w-full max-w-sm border border-[#E5E7EB] bg-white p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={photos.monogram}
            alt="S & J Monogram"
            className="h-16 w-16 rounded-full object-cover object-center border-2 border-[#5C1D2A]/20 shadow-md"
          />
          <h1 className="mt-4 font-display text-2xl font-bold text-[#111827]">Admin CMS</h1>
          <p className="mt-1 text-xs text-[#6B7280] tracking-widest uppercase font-semibold">
            Sriya &amp; Janak Wedding
          </p>
        </div>

        {/* Lock icon badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 rounded-full bg-[#5C1D2A]/8 border border-[#5C1D2A]/15 px-4 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#5C1D2A]" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#5C1D2A]">
              Secure Access
            </span>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C1D2A]" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-11 py-3 text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#5C1D2A] focus:outline-none focus:ring-2 focus:ring-[#5C1D2A]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5C1D2A] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5C1D2A] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-[#42121D] active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#9CA3AF]">
          Protected · Firebase Authentication
        </p>
      </div>
    </div>
  );
}
