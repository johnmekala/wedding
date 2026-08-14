import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath, type ReelsSectionData, type CelebrationReelItem } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { toast } from "sonner";
import { Video, Plus, Trash2, Save, ArrowUp, ArrowDown, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/reels")({
  component: AdminReelsCMS,
});

function AdminReelsCMS() {
  const data = useWeddingData();
  const [reelsSection, setReelsSection] = useState<ReelsSectionData>(
    data.reelsSection || {
      sectionLabel: "Celebration Highlights",
      sectionTitle: "Moments In Motion",
      autoScrollSpeed: "medium",
      direction: "left",
      items: [],
    }
  );

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setReelsSection(
        data.reelsSection || {
          sectionLabel: "Celebration Highlights",
          sectionTitle: "Moments In Motion",
          autoScrollSpeed: "medium",
          direction: "left",
          items: [],
        }
      );
    }
  }, [data.loading, data.reelsSection]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWeddingPath("reelsSection", reelsSection);
      toast.success("Celebration Reels & Highlights saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save celebration reels");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = (type: "video" | "image") => {
    const items = reelsSection.items || [];
    const newItem: CelebrationReelItem = {
      id: Date.now().toString(),
      type: type,
      url: type === "video" ? "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-41584-large.mp4" : "/images/yay.jpg",
      ...(type === "video" ? { thumbnail: "/images/hero_photograph.jpg" } : {}),
      title: type === "video" ? "New Video Reel" : "New Celebration Photo",
      caption: "A special moment from the celebration",
      visible: true,
      order: items.length + 1,
    };
    // Insert top by default
    setReelsSection({
      ...reelsSection,
      items: [newItem, ...items],
    });
    toast.info(`New ${type === "video" ? "Reel" : "Photo"} added at the top. Fill details and save.`);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const items = [...(reelsSection.items || [])];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const moved = items.splice(index, 1)[0];
    if (moved) {
      items.splice(target, 0, moved);
      setReelsSection({ ...reelsSection, items });
    }
  };

  const handleToggleVisibility = (index: number) => {
    const items = [...(reelsSection.items || [])];
    if (items[index]) {
      items[index] = { ...items[index], visible: items[index].visible === false ? true : false };
      setReelsSection({ ...reelsSection, items });
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const items = [...(reelsSection.items || [])];
      items.splice(deleteIndex, 1);
      setReelsSection({ ...reelsSection, items });
      setDeleteIndex(null);
      toast.info("Item removed. Remember to save changes.");
    }
  };

  const items = reelsSection.items || [];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Video className="h-6 w-6 text-gold" /> Celebration Reels &amp; Auto-Scroll CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage auto-scrolling video reels &amp; photos displayed right below Celebration Chapters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddItem("video")}
            className="flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold-light hover:bg-gold/20 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Video Reel
          </button>
          <button
            onClick={() => handleAddItem("image")}
            className="flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold-light hover:bg-gold/20 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Photo
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Section"}
          </button>
        </div>
      </div>

      {/* Section Headings & Speed Controls */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Section Headings &amp; Auto-Scroll Speed</h2>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-caps text-xs text-gold/80 block mb-1">Section Small Label</label>
            <input
              type="text"
              value={reelsSection.sectionLabel || ""}
              onChange={(e) => setReelsSection({ ...reelsSection, sectionLabel: e.target.value })}
              placeholder="Celebration Highlights"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 block mb-1">Section Main Title</label>
            <input
              type="text"
              value={reelsSection.sectionTitle || ""}
              onChange={(e) => setReelsSection({ ...reelsSection, sectionTitle: e.target.value })}
              placeholder="Moments In Motion"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 block mb-1">Auto-Scroll Speed</label>
            <select
              value={reelsSection.autoScrollSpeed || "medium"}
              onChange={(e) =>
                setReelsSection({
                  ...reelsSection,
                  autoScrollSpeed: e.target.value as "slow" | "medium" | "fast",
                })
              }
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            >
              <option value="slow">Slow (55s loop)</option>
              <option value="medium">Medium (35s loop)</option>
              <option value="fast">Fast (20s loop)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg text-gold-light">Reels &amp; Photos ({items.length})</h2>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gold/30 bg-nearblack/40 p-8 text-center text-ivory/60">
            <p>No reels or photos added yet. Click above to add video reels or photos.</p>
          </div>
        ) : (
          items.map((item: any, idx: number) => {
            const isVideo = item.type === "video";
            return (
              <div
                key={item.id || idx}
                className={`rounded-lg border bg-nearblack/70 p-5 space-y-4 transition-all ${
                  item.visible === false ? "border-gold/15 opacity-60" : "border-gold/30"
                }`}
              >
                <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 font-mono text-xs text-gold">
                      #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] label-caps ${
                        isVideo
                          ? "border border-gold/40 bg-gold/15 text-gold-light"
                          : "border border-ivory/30 bg-white/10 text-ivory"
                      }`}
                    >
                      {isVideo ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                      {isVideo ? "Video Reel" : "Photo"}
                    </span>
                    <h3 className="font-display text-base text-ivory font-medium">
                      {item.title || (isVideo ? "Untitled Reel" : "Untitled Photo")}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === items.length - 1}
                      className="p-1.5 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(idx)}
                      className="p-1.5 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded"
                      title={item.visible === false ? "Show item" : "Hide item"}
                    >
                      {item.visible === false ? <EyeOff className="h-4 w-4 text-rose-400" /> : <Eye className="h-4 w-4 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => setDeleteIndex(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Form Controls for Item */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-caps text-xs text-gold/80 block mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => {
                        const updated = items.map((it: any, i: number) => (i === idx ? { ...it, title: e.target.value } : it));
                        setReelsSection({ ...reelsSection, items: updated });
                      }}
                      placeholder="Title"
                      className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="label-caps text-xs text-gold/80 block mb-1">Media Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const newType = e.target.value as "video" | "image";
                        const updated = items.map((it: any, i: number) => (i === idx ? { ...it, type: newType } : it));
                        setReelsSection({ ...reelsSection, items: updated });
                      }}
                      className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    >
                      <option value="video">Video Reel</option>
                      <option value="image">Photo</option>
                    </select>
                  </div>
                </div>

                <MediaPickerInput
                  label={isVideo ? "Video File URL / Upload (MP4 / WebM)" : "Photo URL / Upload"}
                  value={item.url || ""}
                  onChange={(url) => {
                    const updated = items.map((it: any, i: number) => (i === idx ? { ...it, url } : it));
                    setReelsSection({ ...reelsSection, items: updated });
                  }}
                  isVideo={isVideo}
                  helpText={isVideo ? "URL of the short video reel" : "High-resolution photo for the auto-scroll track"}
                />

                {isVideo && (
                  <MediaPickerInput
                    label="Video Thumbnail Poster (Optional)"
                    value={item.thumbnail || ""}
                    onChange={(url) => {
                      const updated = items.map((it: any, i: number) => (i === idx ? { ...it, thumbnail: url } : it));
                      setReelsSection({ ...reelsSection, items: updated });
                    }}
                    helpText="Preview thumbnail image shown before play or in video cards"
                  />
                )}

                <div>
                  <label className="label-caps text-xs text-gold/80 block mb-1">Caption / Subtitle</label>
                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const updated = items.map((it: any, i: number) => (i === idx ? { ...it, caption: e.target.value } : it));
                      setReelsSection({ ...reelsSection, items: updated });
                    }}
                    placeholder="Short description or moment note"
                    className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <DeleteConfirmModal
          isOpen={true}
          title="Delete Celebration Item?"
          message="Are you sure you want to remove this reel/photo? Remember to click 'Save Section' afterwards to commit changes."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
}
