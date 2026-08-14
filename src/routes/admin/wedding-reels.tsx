import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useWeddingData,
  updateWeddingPath,
  type WeddingReelsSectionData,
  type CelebrationReelItem,
} from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { toast } from "sonner";
import {
  Video,
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Play,
  Instagram,
} from "lucide-react";

export const Route = createFileRoute("/admin/wedding-reels")({
  component: AdminWeddingReelsCMS,
});

function AdminWeddingReelsCMS() {
  const data = useWeddingData();
  const [section, setSection] = useState<WeddingReelsSectionData>(
    data.weddingReelsSection || {
      enabled: true,
      sectionLabel: "Celebration Highlights",
      sectionTitle: "Reels",
      subtitle: "Memorable moments in motion as we count down to our special day",
      autoScrollSpeed: "medium",
      items: [],
    }
  );
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setSection(
        data.weddingReelsSection || {
          enabled: true,
          sectionLabel: "Celebration Highlights",
          sectionTitle: "Reels",
          subtitle: "Memorable moments in motion as we count down to our special day",
          autoScrollSpeed: "medium",
          items: [],
        }
      );
    }
  }, [data.loading, data.weddingReelsSection]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWeddingPath("weddingReelsSection", section);
      toast.success("Until We Say I Do — Reels saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Reels section");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = (type: "video" | "image") => {
    const items = section.items || [];
    const newItem: CelebrationReelItem = {
      id: Date.now().toString(),
      type,
      url:
        type === "video"
          ? "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-41584-large.mp4"
          : "/images/yay.jpg",
      instagramUrl: "https://www.instagram.com/reel/",
      ...(type === "video" ? { thumbnail: "/images/hero_photograph.jpg" } : {}),
      title: type === "video" ? "New Wedding Reel" : "New Wedding Photo",
      caption: "A special wedding moment",
      visible: true,
      order: items.length + 1,
    };
    setSection({ ...section, items: [newItem, ...items] });
    toast.info(`New ${type === "video" ? "Reel" : "Photo"} added. Save changes to persist.`);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const items = [...(section.items || [])];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const moved = items.splice(index, 1)[0];
    if (moved) {
      items.splice(target, 0, moved);
      setSection({ ...section, items });
    }
  };

  const handleToggleVisible = (index: number) => {
    const items = [...(section.items || [])];
    const item = items[index];
    if (item) {
      items[index] = { ...item, visible: !item.visible };
      setSection({ ...section, items });
    }
  };

  const handleDelete = (index: number) => {
    const items = [...(section.items || [])];
    items.splice(index, 1);
    setSection({ ...section, items });
    setDeleteIndex(null);
    toast.success("Reel item removed. Click Save Changes to persist.");
  };

  const updateItem = (index: number, updates: Partial<CelebrationReelItem>) => {
    const items = [...(section.items || [])];
    const item = items[index];
    if (item) {
      items[index] = { ...item, ...updates };
      setSection({ ...section, items });
    }
  };

  const items = section.items || [];
  const isEnabled = section.enabled !== false;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4 gap-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Video className="h-6 w-6 text-gold" /> Until We Say I Do — Reels
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage the standalone Reels section positioned immediately below "Until We Say I Do".
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-5 py-2.5 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Master Toggle & Section Settings */}
      <div className="rounded-xl border border-gold/25 bg-nearblack/60 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gold/15 pb-4">
          <div>
            <h2 className="font-display text-lg text-gold-light">Section Status</h2>
            <p className="text-xs text-ivory/60 mt-0.5">
              Turn the Reels section ON or OFF on the public website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSection({ ...section, enabled: !isEnabled })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs label-caps font-medium transition-all ${
              isEnabled
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}
          >
            {isEnabled ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Section ON
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-400" /> Section OFF
              </>
            )}
          </button>
        </div>

        {!isEnabled && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              The Reels section is currently <strong>disabled (OFF)</strong>. It will be hidden on the public website. All saved reels remain safely preserved in CMS.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs label-caps text-ivory/60 mb-1">Section Label (Badge)</label>
            <input
              type="text"
              value={section.sectionLabel || ""}
              onChange={(e) => setSection({ ...section, sectionLabel: e.target.value })}
              className="w-full rounded border border-gold/20 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              placeholder="Until We Say I Do — Reels"
            />
          </div>
          <div>
            <label className="block text-xs label-caps text-ivory/60 mb-1">Section Title</label>
            <input
              type="text"
              value={section.sectionTitle || ""}
              onChange={(e) => setSection({ ...section, sectionTitle: e.target.value })}
              className="w-full rounded border border-gold/20 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              placeholder="Reels"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs label-caps text-ivory/60 mb-1">Subtitle (Optional)</label>
            <input
              type="text"
              value={section.subtitle || ""}
              onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
              className="w-full rounded border border-gold/20 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              placeholder="Optional tagline below the section title"
            />
          </div>
          <div>
            <label className="block text-xs label-caps text-ivory/60 mb-1">Auto-Scroll Speed</label>
            <select
              value={section.autoScrollSpeed || "medium"}
              onChange={(e) =>
                setSection({
                  ...section,
                  autoScrollSpeed: e.target.value as "slow" | "medium" | "fast",
                })
              }
              className="w-full rounded border border-gold/20 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Buttons Bar */}
      <div className="flex items-center justify-between bg-nearblack/40 p-4 rounded-xl border border-gold/15">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAddItem("video")}
            className="flex items-center gap-2 rounded border border-gold/40 bg-gold/20 px-4 py-2 text-xs label-caps text-gold-light hover:bg-gold/30 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> + Add Reel (Video)
          </button>
          <button
            onClick={() => handleAddItem("image")}
            className="flex items-center gap-2 rounded border border-gold/30 bg-black/40 px-4 py-2 text-xs label-caps text-ivory/80 hover:bg-gold/10 transition-colors"
          >
            <Plus className="h-4 w-4" /> + Add Photo
          </button>
        </div>
        <span className="text-xs text-gold/70 label-caps font-mono">{items.length} Reel(s) configured</span>
      </div>

      {/* Reels Items List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/30 p-12 text-center text-ivory/40 text-sm bg-black/20">
          <Video className="h-10 w-10 mx-auto text-gold/40 mb-3" />
          No reels added yet. Click <strong>+ Add Reel</strong> to add your first video reel.
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`rounded-xl border p-5 space-y-4 transition-all ${
                item.visible !== false
                  ? "border-gold/30 bg-black/50 shadow-md"
                  : "border-gray-800 bg-black/20 opacity-60"
              }`}
            >
              {/* Item Header */}
              <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded text-ivory/40 hover:text-gold hover:bg-gold/10 disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === items.length - 1}
                      className="p-1 rounded text-ivory/40 hover:text-gold hover:bg-gold/10 disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {item.type === "video" ? (
                      <Video className="h-4 w-4 text-gold" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-gold" />
                    )}
                    <span className="font-mono text-xs text-gold/70">#{idx + 1}</span>
                    <span className="font-display text-base text-ivory font-medium">
                      {item.title || (item.type === "video" ? "Untitled Reel" : "Untitled Photo")}
                    </span>
                    <span
                      className={`label-caps text-[0.65rem] px-2.5 py-0.5 rounded-full border ${
                        item.type === "video"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                          : "border-blue-500/40 bg-blue-500/10 text-blue-300"
                      }`}
                    >
                      {item.type === "video" ? "Video Reel" : "Photo"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisible(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs label-caps transition-colors border ${
                      item.visible !== false
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    }`}
                  >
                    {item.visible !== false ? (
                      <><Eye className="h-3.5 w-3.5" /> Visible</>
                    ) : (
                      <><EyeOff className="h-3.5 w-3.5" /> Hidden</>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteIndex(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                    title="Delete Reel"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Item Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs label-caps text-ivory/60 mb-1">Reel Title</label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => updateItem(idx, { title: e.target.value })}
                    className="w-full rounded border border-gold/20 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    placeholder="e.g. Golden Hour Stroll"
                  />
                </div>
                <div>
                  <label className="block text-xs label-caps text-ivory/60 mb-1">Caption</label>
                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => updateItem(idx, { caption: e.target.value })}
                    className="w-full rounded border border-gold/20 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    placeholder="Short description / caption"
                  />
                </div>

                {/* Instagram Reel URL Field */}
                <div className="sm:col-span-2">
                  <label className="block text-xs label-caps text-gold-light font-medium mb-1 flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-gold" /> Instagram Reel URL (Required Redirect Link)
                  </label>
                  <input
                    type="url"
                    value={item.instagramUrl || ""}
                    onChange={(e) => updateItem(idx, { instagramUrl: e.target.value })}
                    className="w-full rounded border border-gold/30 bg-black/50 px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none font-mono text-xs"
                    placeholder="https://www.instagram.com/reel/ABC123/"
                  />
                  <p className="text-[0.68rem] text-ivory/50 mt-1 italic">
                    Paste the specific Instagram Reel URL for Reel #{idx + 1}. When visitors click this reel on the website, it will open this URL in a new tab.
                  </p>
                </div>

                {/* Cloudinary / Media Picker Integration */}
                <div className="sm:col-span-2">
                  <MediaPickerInput
                    label={item.type === "video" ? "Video File / Cloudinary URL" : "Image File / Cloudinary URL"}
                    value={item.url || ""}
                    onChange={(url) => updateItem(idx, { url })}
                    accept={item.type === "video" ? "video/*" : "image/*"}
                    placeholder={
                      item.type === "video"
                        ? "Upload video to Cloudinary or paste URL"
                        : "Upload image to Cloudinary or paste URL"
                    }
                    isVideo={item.type === "video"}
                  />
                </div>

                {item.type === "video" && (
                  <div className="sm:col-span-2">
                    <MediaPickerInput
                      label="Video Thumbnail Image (shown before playing)"
                      value={item.thumbnail || ""}
                      onChange={(url) => updateItem(idx, { thumbnail: url })}
                      accept="image/*"
                      placeholder="Upload thumbnail to Cloudinary or paste URL"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Reel?"
        message={`Are you sure you want to remove "${
          deleteIndex !== null ? items[deleteIndex]?.title || "this reel" : ""
        }"?`}
        onConfirm={() => deleteIndex !== null && handleDelete(deleteIndex)}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
