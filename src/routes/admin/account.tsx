import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/admin/account")({
  component: AdminAccountSettings,
});

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  label,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C1D2A]" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-11 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#5C1D2A] focus:outline-none focus:ring-2 focus:ring-[#5C1D2A]/10 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5C1D2A] transition-colors"
          tabIndex={-1}
          title={show ? "Hide" : "Show"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

const ADMIN_EMAIL = "admin@wedding.com";

function AdminAccountSettings() {
  const currentUser = auth.currentUser;

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const passwordsMatch = newPw && confirmPw && newPw === confirmPw;
  const passwordsMismatch = newPw && confirmPw && newPw !== confirmPw;

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    if (newPw.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPw === currentPw) {
      toast.error("New password must be different from your current password.");
      return;
    }

    setPwSaving(true);
    try {
      if (currentUser?.email) {
        // Firebase user — reauthenticate then update
        const cred = EmailAuthProvider.credential(currentUser.email, currentPw);
        await reauthenticateWithCredential(currentUser, cred);
        await updatePassword(currentUser, newPw);
        toast.success("Password changed successfully! Use your new password next time you log in.");
      } else {
        // Local fallback session — validate against default password
        if (currentPw !== "admin123") {
          toast.error("Current password is incorrect.");
          return;
        }
        // For local fallback, store new password in localStorage
        localStorage.setItem("admin_custom_password", newPw);
        toast.success("Password updated! Use your new password next time you log in.");
      }
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        toast.error("Current password is incorrect.");
      } else if (err.code === "auth/requires-recent-login") {
        toast.error("Session expired. Please log out and log back in, then try again.");
      } else if (err.code === "auth/weak-password") {
        toast.error("New password is too weak. Use at least 6 characters.");
      } else {
        toast.error(err.message || "Failed to update password. Please try again.");
      }
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="font-display text-2xl font-bold text-[#111827] flex items-center gap-2.5">
          <ShieldCheck className="h-6 w-6 text-[#5C1D2A]" />
          Account Settings
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage your admin login password. All changes require your current password.
        </p>
      </div>

      {/* Currently Signed In Info */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5C1D2A]/20 bg-[#5C1D2A]/8 shrink-0">
          <KeyRound className="h-5 w-5 text-[#5C1D2A]" />
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#6B7280]">Signed In As</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-[#111827]">
            {currentUser?.email ?? ADMIN_EMAIL}
          </p>
          <p className="text-[0.65rem] text-[#9CA3AF] mt-0.5">
            {currentUser ? "Firebase Authentication" : "Local fallback session"}
          </p>
        </div>
      </div>

      {/* Warning if no Firebase user */}
      {!currentUser && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">Using local fallback session</p>
            <p className="text-xs text-amber-700">
              You're signed in locally. Password changes will be saved locally. For full Firebase-backed auth, create a user at{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium text-amber-900"
              >
                Firebase Console
              </a>{" "}
              with email <span className="font-mono font-semibold">admin@wedding.com</span>.
            </p>
          </div>
        </div>
      )}

      {/* Change Password Card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#F3F4F6] pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5C1D2A]/8 border border-[#5C1D2A]/15">
            <Lock className="h-4 w-4 text-[#5C1D2A]" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-[#111827]">Change Password</h2>
            <p className="text-xs text-[#6B7280]">Minimum 6 characters required</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            id="current-pw"
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="Your current password"
          />
          <PasswordInput
            id="new-pw"
            label="New Password (min 6 characters)"
            value={newPw}
            onChange={setNewPw}
            placeholder="Enter new secure password"
          />
          <PasswordInput
            id="confirm-pw"
            label="Confirm New Password"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="Re-enter new password"
          />

          {/* Match indicator */}
          {newPw && confirmPw && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${passwordsMatch ? "text-emerald-600" : "text-rose-500"}`}>
              {passwordsMatch ? (
                <><CheckCircle2 className="h-3.5 w-3.5" /> Passwords match</>
              ) : (
                <><AlertTriangle className="h-3.5 w-3.5" /> Passwords do not match</>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={pwSaving || Boolean(passwordsMismatch)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5C1D2A] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#42121D] active:scale-[0.98] transition-all disabled:opacity-40 shadow-sm mt-2"
          >
            <RefreshCcw className={`h-4 w-4 ${pwSaving ? "animate-spin" : ""}`} />
            {pwSaving ? "Updating Password…" : "Change Password"}
          </button>
        </form>
      </div>

      <p className="text-xs text-[#9CA3AF] leading-relaxed">
        <span className="font-semibold text-[#6B7280]">Note:</span> Changes apply to your Firebase Authentication account.
        After changing your password, you'll need to use the new password on your next login.
      </p>
    </div>
  );
}
