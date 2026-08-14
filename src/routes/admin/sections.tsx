import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath, type SectionItem } from "@/lib/useWeddingData";
import { Layers, Save, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/sections")({
  component: AdminSectionsCMS,
});

function AdminSectionsCMS() {
  const data = useWeddingData();
  const normalizeSections = (list: SectionItem[]) => {
    const clean = (list || []).filter((s) => s.id !== "rsvp");
    if (!clean.some((s) => s.id === "weddingReels")) {
      // Insert weddingReels after moment (order 7.5)
      const momentIdx = clean.findIndex((s) => s.id === "moment");
      const weddingReelsItem: SectionItem = {
        id: "weddingReels",
        name: "Wedding Reels",
        enabled: true,
        order: 7.5,
      };
      if (momentIdx !== -1) {
        clean.splice(momentIdx + 1, 0, weddingReelsItem);
      } else {
        clean.push(weddingReelsItem);
      }
    }
    if (!clean.some((s) => s.id === "departmentDetails")) {
      clean.push({
        id: "departmentDetails",
        name: "Department Details",
        enabled: true,
        order: clean.length + 1,
      });
    }
    return clean;
  };

  const [sections, setSections] = useState<SectionItem[]>(normalizeSections(data.sections || []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setSections(normalizeSections(data.sections || []));
    }
  }, [data.loading, data.sections]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Re-assign explicit order index before saving
      const ordered = sections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
      await updateWeddingPath("sections", ordered);
      toast.success("Section layout and visibility updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save section ordering");
    } finally {
      setSaving(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const updated = [...sections];
    const moved = updated.splice(index, 1)[0];
    if (moved) {
      updated.splice(target, 0, moved);
      setSections(updated);
    }
  };

  const toggleEnable = (index: number) => {
    const updated = [...sections];
    if (updated[index]) {
      updated[index] = { ...updated[index], enabled: !updated[index].enabled };
      setSections(updated);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Layers className="h-6 w-6 text-gold" /> Global Section Manager
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Enable, disable, or reorder public homepage sections in real time
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Section Order"}
        </button>
      </div>

      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Homepage Section Sequence</h2>

        <div className="space-y-3">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`flex items-center justify-between p-4 rounded border transition-all ${
                sec.enabled
                  ? "border-gold/25 bg-black/40 text-ivory"
                  : "border-gray-800 bg-black/20 text-ivory/40 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === sections.length - 1}
                    className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-mono text-xs text-gold/70 w-6">#{idx + 1}</span>
                <div>
                  <input
                    type="text"
                    value={sec.name}
                    onChange={(e) => {
                      const updated = [...sections];
                      if (updated[idx]) {
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setSections(updated);
                      }
                    }}
                    className="font-medium text-sm bg-transparent border-b border-transparent hover:border-gold/30 focus:border-gold focus:outline-none px-1 text-ivory"
                  />
                  <p className="text-[0.65rem] text-ivory/40 font-mono">ID: {sec.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleEnable(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs label-caps transition-colors ${
                    sec.enabled
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {sec.enabled ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Enabled
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Disabled
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
