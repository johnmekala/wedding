import { createFileRoute, Link } from "@tanstack/react-router";
import { useWeddingData } from "@/lib/useWeddingData";
import {
  CalendarDays,
  Image as ImageIcon,
  Music,
  ArrowRight,
  Heart,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const data = useWeddingData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-gold-light">Wedding CMS Dashboard</h1>
        <p className="mt-1 text-sm text-ivory/60">
          Realtime control panel for Sriya &amp; Janak's wedding invitation
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-gold-light">
            <span className="label-caps">Celebration Events</span>
            <CalendarDays className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 font-display text-4xl text-ivory">{data.events.length}</p>
          <p className="mt-1 text-xs text-ivory/60">24–27 August 2026</p>
        </div>

        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-gold-light">
            <span className="label-caps">Gallery Photos</span>
            <ImageIcon className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 font-display text-4xl text-ivory">{data.gallery.length}</p>
          <p className="mt-1 text-xs text-ivory/60">High-res photos</p>
        </div>

        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-gold-light">
            <span className="label-caps">Music Status</span>
            <Music className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 font-display text-lg text-gold-light truncate">/audio/wedding-song.mp3</p>
          <p className="mt-1 text-xs text-ivory/60">Autoplay on entry active</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Hero Preview */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gold/15 pb-4">
            <h3 className="font-display text-xl text-gold-light">Current Hero Visual</h3>
            <Link
              to="/admin/hero"
              className="flex items-center gap-1 text-xs text-gold hover:underline"
            >
              Manage Hero <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded border border-gold/30">
            <img
              src={data.hero.heroImage}
              alt="Hero Couple Visual"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nearblack/80 via-transparent to-transparent p-4 flex flex-col justify-end">
              <p className="font-display text-lg text-ivory">
                {data.hero.brideName} &amp; {data.hero.groomName}
              </p>
              <p className="text-xs text-gold-light">{data.hero.dateText}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-4">
          <div className="border-b border-gold/15 pb-4">
            <h3 className="font-display text-xl text-gold-light">Quick Management</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/admin/couple"
              className="flex items-center gap-3 rounded border border-gold/20 bg-black/40 p-3 hover:bg-gold/10 transition-colors text-ivory"
            >
              <Heart className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-xs font-semibold">Couple &amp; Story</p>
                <p className="text-[0.65rem] text-ivory/50">Edit names &amp; details</p>
              </div>
            </Link>
            <Link
              to="/admin/reels"
              className="flex items-center gap-3 rounded border border-gold/20 bg-black/40 p-3 hover:bg-gold/10 transition-colors text-ivory"
            >
              <Video className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-xs font-semibold">Celebration Reels</p>
                <p className="text-[0.65rem] text-ivory/50">Manage video clips</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
