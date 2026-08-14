import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useWeddingData,
  updateWeddingPath,
  type HeroVideoData,
} from "@/lib/useWeddingData";
import { extractYouTubeId } from "@/components/wedding/CinematicHero";
import { toast } from "sonner";
import {
  Video,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  ExternalLink,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/admin/hero-video")({
  component: AdminHeroVideoCMS,
});

function AdminHeroVideoCMS() {
  const data = useWeddingData();
  const [heroVideo, setHeroVideo] = useState<HeroVideoData>(
    data.heroVideo || {
      enabled: true,
      youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    }
  );
  const [saving, setSaving] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (!data.loading) {
      setHeroVideo(
        data.heroVideo || {
          enabled: true,
          youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        }
      );
    }
  }, [data.loading, data.heroVideo]);

  const extractedId = extractYouTubeId(heroVideo.youtubeUrl);
  const isEnabled = heroVideo.enabled !== false;

  const handleUrlChange = (newUrl: string) => {
    setHeroVideo((prev) => ({ ...prev, youtubeUrl: newUrl }));

    if (!newUrl.trim()) {
      setUrlError("YouTube URL cannot be empty.");
      return;
    }

    const id = extractYouTubeId(newUrl);
    if (!id) {
      setUrlError("Please enter a valid YouTube video URL.");
    } else {
      setUrlError(null);
    }
  };

  const handleSave = async () => {
    if (isEnabled && (!heroVideo.youtubeUrl || !extractedId)) {
      setUrlError("Please enter a valid YouTube video URL.");
      toast.error("Please enter a valid YouTube video URL before saving.");
      return;
    }

    try {
      setSaving(true);
      await updateWeddingPath("heroVideo", heroVideo);
      toast.success("Hero Video configuration saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Hero Video configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4 gap-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Video className="h-6 w-6 text-gold" /> Hero Video
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Configure the background YouTube video displayed in the main Hero Section.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || (isEnabled && Boolean(urlError))}
          className="flex items-center gap-2 rounded bg-gold px-5 py-2.5 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Master Status & Settings Card */}
      <div className="rounded-xl border border-gold/25 bg-nearblack/60 p-6 space-y-6 shadow-xl">
        {/* Master ON / OFF Toggle */}
        <div className="flex items-center justify-between border-b border-gold/15 pb-5">
          <div>
            <h2 className="font-display text-lg text-gold-light flex items-center gap-2">
              Hero Video Status
            </h2>
            <p className="text-xs text-ivory/60 mt-0.5">
              Turn Hero Video ON to show YouTube video background, or OFF to use fallback.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setHeroVideo((prev) => ({ ...prev, enabled: !isEnabled }))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs label-caps font-medium transition-all ${
              isEnabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}
          >
            {isEnabled ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hero Video ON
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" /> Hero Video OFF
              </>
            )}
          </button>
        </div>

        {!isEnabled && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Hero Video is currently <strong>disabled (OFF)</strong>. The public website will automatically display the static fallback Hero photograph background.
            </span>
          </div>
        )}

        {/* YouTube Video URL Field */}
        <div className="space-y-2">
          <label className="block text-xs label-caps text-gold-light font-medium flex items-center gap-2">
            YouTube Video URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={heroVideo.youtubeUrl || ""}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4 or https://youtu.be/ScMzIvxBSi4"
              className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 font-mono focus:outline-none transition-colors ${
                urlError
                  ? "border-rose-500 focus:border-rose-400"
                  : "border-gold/30 focus:border-gold"
              }`}
            />
          </div>

          {urlError ? (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" /> {urlError}
            </p>
          ) : extractedId ? (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Valid YouTube Video ID:{" "}
              <span className="font-mono text-gold-light font-semibold">{extractedId}</span>
            </p>
          ) : null}

          <p className="text-[0.72rem] text-ivory/50 mt-1 italic">
            Supports common YouTube formats: <code>https://www.youtube.com/watch?v=...</code> or <code>https://youtu.be/...</code>. The video ID will be extracted automatically.
          </p>
        </div>

        {/* Preview Container */}
        {extractedId ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm text-gold-light flex items-center gap-2">
                <Play className="h-4 w-4 text-gold fill-gold" /> YouTube Video Preview
              </h3>
              <a
                href={`https://www.youtube.com/watch?v=${extractedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold/80 hover:text-gold flex items-center gap-1"
              >
                Open on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gold/30 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${extractedId}?autoplay=1&mute=1&loop=1&playlist=${extractedId}&controls=1&modestbranding=1`}
                title="YouTube Video Preview"
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
