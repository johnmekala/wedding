import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { photos } from "@/data/wedding";
import {
  LayoutDashboard,
  Sparkles,
  Heart,
  Users2,
  HeartHandshake,
  CalendarDays,
  Video,
  Quote,
  Image as ImageIcon,
  FolderOpen,
  Users,
  Music,
  Compass,
  Footprints,
  Layers,
  Sliders,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  KeyRound,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/navigation", label: "Navbar & Brand", icon: Compass },
  { to: "/admin/hero", label: "Hero & Temple Intro", icon: Sparkles },
  { to: "/admin/hero-video", label: "Hero Video", icon: Video },
  { to: "/admin/couple", label: "Couple & Story", icon: Heart },
  { to: "/admin/family", label: "Family Blessings", icon: Users2 },
  { to: "/admin/special-blessings", label: "Special Blessings", icon: HeartHandshake },
  { to: "/admin/events", label: "Celebration Events", icon: CalendarDays },
  { to: "/admin/reels", label: "Celebration Reels", icon: Video },
  { to: "/admin/wedding-reels", label: "Until We Say I Do — Reels", icon: Video },
  { to: "/admin/quotes", label: "Quotes & Moments", icon: Quote },
  { to: "/admin/gallery", label: "Photo Gallery", icon: ImageIcon },
  { to: "/admin/media", label: "Media Library", icon: FolderOpen },
  { to: "/admin/music", label: "Music & Sound", icon: Music },
  { to: "/admin/footer", label: "Footer & Socials", icon: Footprints },
  { to: "/admin/sections", label: "Section Manager", icon: Layers },
  { to: "/admin/settings", label: "SEO & Settings", icon: Sliders },
  { to: "/admin/account", label: "Account Settings", icon: KeyRound },
];

function AdminLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localSession = typeof window !== "undefined" && localStorage.getItem("admin_authenticated") === "true";
    setIsLocalAuth(localSession);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      const isAuthenticated = currentUser || localStorage.getItem("admin_authenticated") === "true";
      if (!isAuthenticated && window.location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login" });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (typeof window !== "undefined" && window.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nearblack text-gold-light">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="font-heading text-sm tracking-[0.2em] uppercase">Loading Admin Console…</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = user || isLocalAuth;
  if (!isAuthenticated) {
    return <Outlet />;
  }

  const handleLogout = async () => {
    localStorage.removeItem("admin_authenticated");
    setIsLocalAuth(false);
    await signOut(auth);
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="admin-theme min-h-screen bg-white text-[#1F2937] flex flex-col md:flex-row">
      {/* Top bar for mobile viewports */}
      <div className="md:hidden flex items-center justify-between border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img
            src={photos.monogram}
            alt="Monogram"
            className="h-8 w-8 rounded-full border border-[#5C1D2A]/30 object-cover object-center overflow-hidden"
          />
          <div>
            <h2 className="font-display text-sm text-[#2C1A0E] leading-tight font-semibold">Sriya &amp; Janak</h2>
            <p className="text-[0.6rem] text-[#5C1D2A] label-caps font-semibold">Admin CMS</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 border border-[#D1D5DB] rounded text-[#5C1D2A] hover:bg-[#F3F4F6]"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#E5E7EB] bg-[#F9FAFB] p-5 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="overflow-y-auto pr-1 space-y-4">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <img
                src={photos.monogram}
                alt="S & J Monogram"
                className="h-10 w-10 rounded-full border border-[#5C1D2A]/30 object-cover object-center overflow-hidden"
              />
              <div>
                <h2 className="font-display text-lg font-bold text-[#2C1A0E]">Sriya &amp; Janak</h2>
                <p className="label-caps text-[0.6rem] text-[#5C1D2A] font-semibold">Wedding CMS</p>
              </div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View Public Site"
              className="p-1.5 rounded border border-[#D1D5DB] text-[#5C1D2A] hover:bg-[#F3F4F6] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Admin Sections">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  activeOptions={{ exact: Boolean(item.exact) }}
                  activeProps={{
                    className:
                      "bg-[#5C1D2A] text-white border-l-4 border-[#3B121B] font-semibold shadow-sm",
                  }}
                  inactiveProps={{
                    className: "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border-l-4 border-transparent",
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-r-md text-xs transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#6E4D37] truncate max-w-[140px]">
            <ShieldCheck className="h-4 w-4 text-[#5C1D2A] shrink-0" />
            <span className="truncate">{user?.email || "admin@wedding.com"}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-1 text-[#5C1D2A] hover:text-[#3B121B] p-1.5 rounded hover:bg-[#F3F4F6] transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl bg-white">
        <Outlet />
      </main>
    </div>
  );
}

