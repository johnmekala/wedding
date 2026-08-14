import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath, type SpecialBlessingsSectionData, type SpecialBlessingItem } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { toast } from "sonner";
import { HeartHandshake, Plus, Trash2, Save, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/special-blessings")({
  component: AdminSpecialBlessingsCMS,
});

function AdminSpecialBlessingsCMS() {
  const data = useWeddingData();
  const [sectionData, setSectionData] = useState<SpecialBlessingsSectionData>(
    data.specialBlessingsSection || {
      enabled: true,
      sectionLabel: "Sacred Wishes",
      sectionTitle: "Special Blessings From",
      items: [],
    }
  );

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setSectionData(
        data.specialBlessingsSection || {
          enabled: true,
          sectionLabel: "Sacred Wishes",
          sectionTitle: "Special Blessings From",
          items: [],
        }
      );
    }
  }, [data.loading, data.specialBlessingsSection]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWeddingPath("specialBlessingsSection", sectionData);
      toast.success("Special Blessings From section saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save special blessings section");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlessing = () => {
    const items = sectionData.items || [];
    const newBlessing: SpecialBlessingItem = {
      id: Date.now().toString(),
      name: "New Well-wisher / Family Name",
      relationship: "Extended Family / Mentor",
      message: "May your journey together be blessed with eternal happiness and harmony.",
      additionalText: "With warm affection",
      enabled: true,
      order: items.length + 1,
    };
    setSectionData({
      ...sectionData,
      items: [newBlessing, ...items],
    });
    toast.info("New blessing entry added. Fill details and save.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const items = [...(sectionData.items || [])];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const moved = items.splice(index, 1)[0];
    if (moved) {
      items.splice(target, 0, moved);
      setSectionData({ ...sectionData, items });
    }
  };

  const handleToggleItemVisibility = (index: number) => {
    const items = sectionData.items || [];
    const updated = items.map((it, i) =>
      i === index ? { ...it, enabled: it.enabled === false ? true : false } : it
    );
    setSectionData({ ...sectionData, items: updated });
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const items = (sectionData.items || []).filter((_, i) => i !== deleteIndex);
      setSectionData({ ...sectionData, items });
      setDeleteIndex(null);
      toast.info("Blessing entry removed. Click 'Save Section' to update RTDB.");
    }
  };

  const items = sectionData.items || [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-gold" /> Special Blessings From CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage the &quot;Special Blessings From&quot; section displayed directly below Family Blessings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddBlessing}
            className="flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold-light hover:bg-gold/20 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Blessing
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

      {/* Section Toggle & Headings */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gold/15 pb-4">
          <div>
            <h2 className="font-display text-lg text-gold-light">Section Visibility</h2>
            <p className="text-xs text-ivory/60">Turn ON/OFF the Special Blessings From section on the website</p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs text-gold/80 font-medium">
              {sectionData.enabled !== false ? "Section ON" : "Section OFF"}
            </span>
            <input
              type="checkbox"
              checked={sectionData.enabled !== false}
              onChange={(e) => setSectionData({ ...sectionData, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-black/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-ivory after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80 block mb-1">Section Small Label</label>
            <input
              type="text"
              value={sectionData.sectionLabel || ""}
              onChange={(e) => setSectionData({ ...sectionData, sectionLabel: e.target.value })}
              placeholder="Sacred Wishes"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 block mb-1">Section Main Heading</label>
            <input
              type="text"
              value={sectionData.sectionTitle || ""}
              onChange={(e) => setSectionData({ ...sectionData, sectionTitle: e.target.value })}
              placeholder="Special Blessings From"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Blessing Cards List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg text-gold-light">Blessing Entries ({items.length})</h2>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gold/30 bg-nearblack/40 p-8 text-center text-ivory/60">
            <p>No blessing entries added yet. Click &quot;+ Add Blessing&quot; above to create one.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`rounded-lg border bg-nearblack/70 p-6 space-y-4 transition-all ${
                item.enabled === false ? "border-gold/15 opacity-60" : "border-gold/30"
              }`}
            >
              {/* Card Header & Tools */}
              <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 font-mono text-xs text-gold">
                    #{idx + 1}
                  </span>
                  <h3 className="font-display text-base text-gold-light font-medium">
                    {item.name || "Untitled Blessing"}
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
                    onClick={() => handleToggleItemVisibility(idx)}
                    className="p-1.5 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded"
                    title={item.enabled === false ? "Enable blessing" : "Disable blessing"}
                  >
                    {item.enabled === false ? <EyeOff className="h-4 w-4 text-rose-400" /> : <Eye className="h-4 w-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setDeleteIndex(idx)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                    title="Delete blessing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-caps text-xs text-gold/80 block mb-1">Name / Person</label>
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) => {
                      const updated = items.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it));
                      setSectionData({ ...sectionData, items: updated });
                    }}
                    placeholder="e.g. His Holiness & Revered Elders"
                    className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="label-caps text-xs text-gold/80 block mb-1">Relationship / Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={item.relationship || ""}
                    onChange={(e) => {
                      const updated = items.map((it, i) => (i === idx ? { ...it, relationship: e.target.value } : it));
                      setSectionData({ ...sectionData, items: updated });
                    }}
                    placeholder="e.g. Spiritual Guidance / Beloved Elders"
                    className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="label-caps text-xs text-gold/80 block mb-1">Blessing Message</label>
                <textarea
                  rows={3}
                  value={item.message || ""}
                  onChange={(e) => {
                    const updated = items.map((it, i) => (i === idx ? { ...it, message: e.target.value } : it));
                    setSectionData({ ...sectionData, items: updated });
                  }}
                  placeholder="Blessing message..."
                  className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>

              <MediaPickerInput
                label="Person / Photo Image (Optional)"
                value={item.image || ""}
                onChange={(url) => {
                  const updated = items.map((it, i) => (i === idx ? { ...it, image: url } : it));
                  setSectionData({ ...sectionData, items: updated });
                }}
                helpText="Optional photo of the person or family giving blessings"
              />

              <div>
                <label className="label-caps text-xs text-gold/80 block mb-1">Additional Text / Note (Optional)</label>
                <input
                  type="text"
                  value={item.additionalText || ""}
                  onChange={(e) => {
                    const updated = items.map((it, i) => (i === idx ? { ...it, additionalText: e.target.value } : it));
                    setSectionData({ ...sectionData, items: updated });
                  }}
                  placeholder="e.g. With heartfelt blessings"
                  className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <DeleteConfirmModal
          isOpen={true}
          title="Delete Blessing Entry?"
          message="Are you sure you want to remove this blessing? Click 'Save Section' afterwards to update RTDB."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
}
