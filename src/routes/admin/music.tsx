import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath } from "@/lib/useWeddingData";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Music, Upload, Save, Play, Pause } from "lucide-react";

export const Route = createFileRoute("/admin/music")({
  component: AdminMusicCMS,
});

function AdminMusicCMS() {
  const data = useWeddingData();
  const [trackUrl, setTrackUrl] = useState<string>(data.musicTrack);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!data.loading) {
      setTrackUrl(data.musicTrack);
    }
  }, [data.loading, data.musicTrack]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWeddingPath("musicTrack", trackUrl);
      toast.success("Wedding song updated successfully!");
    } catch (err) {
      toast.error("Failed to save audio settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSong = async (file: File) => {
    try {
      setUploading(true);
      const res = await uploadToCloudinary(file, "music");
      setTrackUrl(res.secure_url);
      toast.success("Audio track uploaded to Cloudinary!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const togglePreview = () => {
    if (isPlayingPreview && previewAudio) {
      previewAudio.pause();
      setIsPlayingPreview(false);
    } else {
      const audio = new Audio(trackUrl);
      audio.volume = 0.25;
      audio.play().then(() => {
        setPreviewAudio(audio);
        setIsPlayingPreview(true);
      }).catch(() => {
        toast.error("Audio playback error");
      });
      audio.onended = () => setIsPlayingPreview(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl text-gold-light">Music &amp; Sound Settings</h1>
        <p className="mt-1 text-sm text-ivory/60">
          Manage the background wedding music track and audio settings
        </p>
      </div>

      <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6">
        <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
          <Music className="h-5 w-5 text-gold" /> Wedding Background Track
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block label-caps text-gold-light mb-1">Audio File URL</label>
            <input
              type="text"
              value={trackUrl}
              onChange={(e) => setTrackUrl(e.target.value)}
              placeholder="/audio/wedding-song.mp3"
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-ivory/50">
              Default path: <code className="text-gold">/audio/wedding-song.mp3</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={togglePreview}
              className="flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-4 py-2 text-xs label-caps text-gold-light hover:bg-gold/20 transition-colors"
            >
              {isPlayingPreview ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlayingPreview ? "Pause Preview" : "Preview Song (25% Vol)"}
            </button>

            <label className="cursor-pointer inline-flex items-center gap-2 rounded border border-gold/40 px-4 py-2 text-xs label-caps text-gold-light hover:bg-gold/15 transition-colors">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading Audio…" : "Upload New Audio File"}
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUploadSong(e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>

        <div className="border-t border-gold/15 pt-4 text-xs text-ivory/60 space-y-2">
          <p>• Audio plays automatically after visitor clicks &ldquo;Enter Our Celebration&rdquo;.</p>
          <p>• Volume defaults to 25% for smooth, non-intrusive background ambience.</p>
          <p>• Floating music button allows guests to toggle sound on/off anytime.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gradient-to-r from-gold-deep via-gold to-gold-deep px-8 py-3.5 font-heading text-sm uppercase tracking-[0.2em] text-maroon-deep font-medium hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving Settings…" : "Save Music Track"}
        </button>
      </div>
    </div>
  );
}
