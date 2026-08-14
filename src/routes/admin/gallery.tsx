import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { toast } from "sonner";
import { Image as ImageIcon, Plus, Trash2, Save, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryCMS,
});

type GalleryItem = {
  id?: string;
  src: string;
  alt: string;
  span?: "tall" | "wide";
  category?: string;
  visible?: boolean;
};

const CATEGORIES = ["Couple", "Engagement", "Pellikuthuru", "Family", "Wedding", "Celebration"];

function AdminGalleryCMS() {
  const data = useWeddingData();
  const [gallery, setGallery] = useState<GalleryItem[]>(data.gallery as GalleryItem[]);
  const [gallerySection, setGallerySection] = useState(data.gallerySection || {
    sectionLabel: "Photographic Moments",
    sectionTitle: "Some Moments Become Forever",
  });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  useEffect(() => {
    if (!data.loading) {
      setGallery(data.gallery as GalleryItem[]);
      if (data.gallerySection) setGallerySection(data.gallerySection);
    }
  }, [data.loading, data.gallery, data.gallerySection]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWeddingPath("gallery", gallery);
      await updateWeddingPath("gallerySection", gallerySection);
      toast.success("Gallery photos & section titles updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update gallery");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhoto = () => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      src: "/images/hero_photograph.jpg",
      alt: "Sriya and Janak moment",
      span: "tall",
      category: "Couple",
      visible: true,
    };
    // Insert at top by default
    setGallery([newItem, ...gallery]);
    toast.info("New gallery item added at the top. Update media and details.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= gallery.length) return;
    const updated = [...gallery];
    const moved = updated.splice(index, 1)[0];
    if (moved) {
      updated.splice(target, 0, moved);
      setGallery(updated);
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = gallery.filter((_, i) => i !== deleteIndex);
      setGallery(updated);
      setDeleteIndex(null);
      toast.info("Gallery item deleted. Remember to save changes.");
    }
  };

  const filteredGallery =
    filterCategory === "All" ? gallery : gallery.filter((item) => item.category === filterCategory);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-gold" /> Photo Gallery CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Upload, add external URLs, categorize, caption, reorder, and toggle visibility of gallery items
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddPhoto}
            className="flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold-light hover:bg-gold/20 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Photo
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Gallery"}
          </button>
        </div>
      </div>

      {/* Section Headings */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Gallery Section Headings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80">Section Small Label</label>
            <input
              type="text"
              value={gallerySection.sectionLabel || ""}
              onChange={(e) => setGallerySection({ ...gallerySection, sectionLabel: e.target.value })}
              placeholder="Photographic Moments"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Section Main Title</label>
            <input
              type="text"
              value={gallerySection.sectionTitle || ""}
              onChange={(e) => setGallerySection({ ...gallerySection, sectionTitle: e.target.value })}
              placeholder="Some Moments Become Forever"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gold/15">
        <span className="text-xs label-caps text-gold-light mr-2">Filter Category:</span>
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded text-xs label-caps transition-colors ${
              filterCategory === cat
                ? "bg-gold text-maroon-deep font-medium"
                : "bg-nearblack border border-gold/30 text-ivory/70 hover:text-ivory"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGallery.map((item, idx) => {
          const actualIndex = gallery.indexOf(item);
          return (
            <div
              key={item.src + idx}
              className="rounded-lg border border-gold/25 bg-nearblack/60 p-4 space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-gold/15 pb-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(actualIndex, "up")}
                    disabled={actualIndex === 0}
                    className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(actualIndex, "down")}
                    disabled={actualIndex === gallery.length - 1}
                    className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gold-light/60 font-mono">#{actualIndex + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = [...gallery];
                      if (updated[actualIndex]) {
                        updated[actualIndex] = {
                          ...updated[actualIndex],
                          visible: !(updated[actualIndex].visible ?? true),
                        };
                        setGallery(updated);
                      }
                    }}
                    className={`p-1 rounded text-xs flex items-center gap-1 ${
                      item.visible ?? true ? "text-emerald-400 hover:bg-emerald-500/10" : "text-amber-400 hover:bg-amber-500/10"
                    }`}
                    title="Toggle visibility"
                  >
                    {item.visible ?? true ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => setDeleteIndex(actualIndex)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <MediaPickerInput
                label="Photo Media"
                value={item.src}
                onChange={(url) => {
                  const updated = [...gallery];
                  if (updated[actualIndex]) {
                    updated[actualIndex] = { ...updated[actualIndex], src: url };
                    setGallery(updated);
                  }
                }}
                altText={item.alt}
                onAltChange={(alt) => {
                  const updated = [...gallery];
                  if (updated[actualIndex]) {
                    updated[actualIndex] = { ...updated[actualIndex], alt };
                    setGallery(updated);
                  }
                }}
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block label-caps text-[0.65rem] text-gold-light mb-1">Grid Layout</label>
                  <select
                    value={item.span || "tall"}
                    onChange={(e) => {
                      const updated = [...gallery];
                      if (updated[actualIndex]) {
                        updated[actualIndex] = {
                          ...updated[actualIndex],
                          span: e.target.value as "tall" | "wide",
                        };
                        setGallery(updated);
                      }
                    }}
                    className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-2 py-1 text-xs text-ivory"
                  >
                    <option value="tall">Tall Aspect</option>
                    <option value="wide">Wide Aspect</option>
                  </select>
                </div>

                <div>
                  <label className="block label-caps text-[0.65rem] text-gold-light mb-1">Category</label>
                  <select
                    value={item.category || "Couple"}
                    onChange={(e) => {
                      const updated = [...gallery];
                      if (updated[actualIndex]) {
                        updated[actualIndex] = { ...updated[actualIndex], category: e.target.value };
                        setGallery(updated);
                      }
                    }}
                    className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-2 py-1 text-xs text-ivory"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Gallery Photo?"
        message="Are you sure you want to remove this photo from the gallery?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
