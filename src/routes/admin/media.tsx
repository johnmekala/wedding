import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath } from "@/lib/useWeddingData";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { photos as defaultPhotos } from "@/data/wedding";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { toast } from "sonner";
import { FolderOpen, Upload, Copy, Check, Filter, Search, Plus, Trash2, Link as LinkIcon, Video, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  component: AdminMediaCMS,
});

export type CustomMediaItem = {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
  category: string;
  createdAt: string;
};

const DEFAULT_MEDIA_ITEMS: CustomMediaItem[] = [
  { id: "1", url: defaultPhotos.awww, name: "Engagement Stage (awww.jpg)", type: "image", category: "Couple", createdAt: "2026-08-01T00:00:00Z" },
  { id: "2", url: defaultPhotos.yay, name: "Sriya Golden Saree (yay.jpg)", type: "image", category: "Bride", createdAt: "2026-08-01T00:00:00Z" },
  { id: "3", url: defaultPhotos.mesmarizing, name: "Silhouetted Golden Light (mesmarizing.jpg)", type: "image", category: "Couple", createdAt: "2026-08-01T00:00:00Z" },
  { id: "4", url: defaultPhotos.hey, name: "Under Arch (hey.jpg)", type: "image", category: "Couple", createdAt: "2026-08-01T00:00:00Z" },
  { id: "5", url: defaultPhotos.ring, name: "Hand Reach (ring.jpg)", type: "image", category: "Pellikuthuru", createdAt: "2026-08-01T00:00:00Z" },
  { id: "6", url: defaultPhotos.aMoment, name: "Ring Ceremony (a_moment.jpg)", type: "image", category: "Events", createdAt: "2026-08-01T00:00:00Z" },
  { id: "7", url: defaultPhotos.wedding, name: "Chandelier Wedding (wedding.jpg)", type: "image", category: "Wedding", createdAt: "2026-08-01T00:00:00Z" },
  { id: "8", url: defaultPhotos.fam, name: "Both Families (fam.jpg)", type: "image", category: "Family", createdAt: "2026-08-01T00:00:00Z" },
  { id: "9", url: defaultPhotos.yes, name: "Quiet Golden Moment (yes.jpg)", type: "image", category: "Couple", createdAt: "2026-08-01T00:00:00Z" },
  { id: "10", url: defaultPhotos.ganesha, name: "Sacred Ganesha Idol (ganesha.png)", type: "image", category: "Branding", createdAt: "2026-08-01T00:00:00Z" },
  { id: "11", url: defaultPhotos.monogram, name: "S & J Monogram Logo (monogram.png)", type: "image", category: "Branding", createdAt: "2026-08-01T00:00:00Z" },
];

export function AdminMediaCMS() {
  const data = useWeddingData();
  const [mediaItems, setMediaItems] = useState<CustomMediaItem[]>(DEFAULT_MEDIA_ITEMS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [externalUrlInput, setExternalUrlInput] = useState("");
  const [externalNameInput, setExternalNameInput] = useState("");
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Sync saved RTDB custom media items if any
  useEffect(() => {
    if (!data.loading) {
      // @ts-ignore
      if (data.mediaLibrary && Array.isArray(data.mediaLibrary)) {
        // @ts-ignore
        setMediaItems(data.mediaLibrary);
      }
    }
  }, [data.loading]);

  const saveMediaLibraryToRTDB = async (items: CustomMediaItem[]) => {
    setMediaItems(items);
    try {
      await updateWeddingPath("mediaLibrary", items);
    } catch (e) {
      console.warn("RTDB media save warning:", e);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Media URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const res = await uploadToCloudinary(file, "media_library");
      const newItem: CustomMediaItem = {
        id: Date.now().toString(),
        url: res.secure_url,
        name: file.name,
        type: file.type.startsWith("video") ? "video" : "image",
        category: "Uploads",
        createdAt: new Date().toISOString(),
      };
      // Appends at top of list
      const updated = [newItem, ...mediaItems];
      await saveMediaLibraryToRTDB(updated);
      toast.success("Uploaded media successfully! URL copied.");
      navigator.clipboard.writeText(res.secure_url);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAddExternalUrl = async () => {
    if (!externalUrlInput.trim()) return;
    const newItem: CustomMediaItem = {
      id: Date.now().toString(),
      url: externalUrlInput.trim(),
      name: externalNameInput.trim() || "External Media Asset",
      type: externalUrlInput.includes(".mp4") || externalUrlInput.includes(".webm") ? "video" : "image",
      category: "External URL",
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...mediaItems];
    await saveMediaLibraryToRTDB(updated);
    setExternalUrlInput("");
    setExternalNameInput("");
    setShowAddUrlModal(false);
    toast.success("External media URL added!");
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      const updated = mediaItems.filter((_, i) => i !== deleteIndex);
      await saveMediaLibraryToRTDB(updated);
      setDeleteIndex(null);
      toast.info("Media item deleted");
    }
  };

  const filtered = mediaItems.filter((item) => {
    const matchesType = filterType === "all" ? true : item.type === filterType;
    const matchesQuery = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesType && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-gold" /> Media Library
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Central repository for images and videos. Upload files or add external media URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddUrlModal(true)}
            className="flex items-center gap-1 rounded border border-gold/30 bg-black/40 px-3 py-2 text-xs text-gold-light hover:bg-gold/10 transition-colors"
          >
            <LinkIcon className="h-3.5 w-3.5" /> Add URL
          </button>
          <label className="cursor-pointer inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/20 px-4 py-2 text-xs font-medium text-gold-light hover:bg-gold/30 transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload Media File"}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
              }}
            />
          </label>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-nearblack/60 p-4 rounded-lg border border-gold/15">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs label-caps text-gold/80">Type:</span>
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded text-xs label-caps ${
              filterType === "all" ? "bg-gold text-nearblack font-medium" : "text-ivory/70 hover:bg-gold/10"
            }`}
          >
            All ({mediaItems.length})
          </button>
          <button
            onClick={() => setFilterType("image")}
            className={`px-3 py-1 rounded text-xs label-caps ${
              filterType === "image" ? "bg-gold text-nearblack font-medium" : "text-ivory/70 hover:bg-gold/10"
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType("video")}
            className={`px-3 py-1 rounded text-xs label-caps ${
              filterType === "video" ? "bg-gold text-nearblack font-medium" : "text-ivory/70 hover:bg-gold/10"
            }`}
          >
            Videos
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gold/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded border border-gold/20 bg-black/50 pl-9 pr-3 py-1.5 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => {
          const isCopied = copiedId === item.id;
          const actualIndex = mediaItems.indexOf(item);
          return (
            <div
              key={item.id + idx}
              className="rounded-lg border border-gold/25 bg-nearblack/60 p-4 space-y-3 relative group"
            >
              <div className="relative aspect-video overflow-hidden rounded border border-gold/30 bg-black flex items-center justify-center">
                {item.type === "video" ? (
                  <video src={item.url} className="h-full w-full object-cover" muted autoPlay loop />
                ) : (
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                )}
                <span className="absolute bottom-2 left-2 rounded bg-nearblack/80 px-2 py-0.5 text-[0.65rem] label-caps text-gold flex items-center gap-1">
                  {item.type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  {item.category}
                </span>
                <button
                  onClick={() => setDeleteIndex(actualIndex)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-black/80 text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete media"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="truncate pr-2">
                  <p className="font-medium text-xs text-ivory truncate">{item.name}</p>
                  <p className="text-[0.65rem] text-ivory/50 truncate">{item.url}</p>
                </div>

                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs label-caps shrink-0 transition-all ${
                    isCopied
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-gold/10 text-gold-light border border-gold/30 hover:bg-gold/20"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add External URL Modal */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gold/30 bg-[#1a1618] p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-xl text-gold-light">Add External Media URL</h3>
            <div>
              <label className="label-caps text-xs text-gold/80 mb-1 block">Media Asset Name</label>
              <input
                type="text"
                value={externalNameInput}
                onChange={(e) => setExternalNameInput(e.target.value)}
                placeholder="e.g. Hero Banner Photo"
                className="w-full rounded border border-gold/25 bg-black/50 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="label-caps text-xs text-gold/80 mb-1 block">Direct Media URL</label>
              <input
                type="url"
                value={externalUrlInput}
                onChange={(e) => setExternalUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://cdn.com/video.mp4"
                className="w-full rounded border border-gold/25 bg-black/50 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddUrlModal(false)}
                className="rounded border border-gold/25 px-4 py-2 text-xs text-ivory/70 hover:bg-gold/10"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExternalUrl}
                className="rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light"
              >
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Media Asset?"
        message="Are you sure you want to remove this media asset from the library?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
