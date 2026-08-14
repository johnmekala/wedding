import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath, type NavigationItem } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Compass, Plus, Trash2, ArrowUp, ArrowDown, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/navigation")({
  component: AdminNavigation,
});

function AdminNavigation() {
  const data = useWeddingData();
  const [logo, setLogo] = useState(data.navigation.logo);
  const [ctaLabel, setCtaLabel] = useState(data.navigation.ctaLabel);
  const [ctaUrl, setCtaUrl] = useState(data.navigation.ctaUrl);
  const [ctaVisible, setCtaVisible] = useState(data.navigation.ctaVisible);
  const [links, setLinks] = useState<NavigationItem[]>(data.navigation.links || []);
  const [saving, setSaving] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!data.loading) {
      setLogo(data.navigation.logo);
      setCtaLabel(data.navigation.ctaLabel);
      setCtaUrl(data.navigation.ctaUrl);
      setCtaVisible(data.navigation.ctaVisible);
      setLinks(data.navigation.links || []);
    }
  }, [data.loading, data.navigation]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWeddingPath("navigation", {
        logo,
        links,
        ctaLabel,
        ctaUrl,
        ctaVisible,
      });
      toast.success("Navbar & Branding settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save navigation settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = () => {
    const newLink: NavigationItem = {
      id: Date.now().toString(),
      label: "New Link",
      href: "#new-section",
      visible: true,
    };
    setLinks([newLink, ...links]); // Add to top by default
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= links.length) return;
    const updated = [...links];
    const moved = updated.splice(index, 1)[0];
    if (moved) {
      updated.splice(target, 0, moved);
      setLinks(updated);
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = [...links];
      updated.splice(deleteIndex, 1);
      setLinks(updated);
      setDeleteIndex(null);
      toast.info("Navbar link removed. Remember to save changes.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Compass className="h-6 w-6 text-gold" /> Navbar &amp; Branding CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage site header logo, menu navigation links, visibility, and call-to-action button
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Navigation"}
        </button>
      </div>

      {/* Branding / Logo */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Header Logo &amp; Monogram</h2>
        <MediaPickerInput
          label="Logo Monogram Image"
          value={logo}
          onChange={setLogo}
          helpText="Circular monogram image rendered at top left of navigation header"
        />
      </div>

      {/* CTA Button */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Header CTA Button</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80">CTA Label</label>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">CTA Target URL / Anchor</label>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="ctaVisible"
            checked={ctaVisible}
            onChange={(e) => setCtaVisible(e.target.checked)}
            className="rounded border-gold/40 text-gold focus:ring-gold"
          />
          <label htmlFor="ctaVisible" className="text-xs text-ivory">
            Enable CTA button in navigation bar
          </label>
        </div>
      </div>

      {/* Menu Links */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gold/15 pb-3">
          <h2 className="font-display text-lg text-gold-light">Navigation Menu Items</h2>
          <button
            onClick={handleAddLink}
            className="flex items-center gap-1 text-xs text-gold hover:text-gold-light border border-gold/30 px-3 py-1.5 rounded hover:bg-gold/10 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Menu Item
          </button>
        </div>

        <div className="space-y-3">
          {links.map((link, idx) => (
            <div
              key={link.id || idx}
              className="flex flex-col sm:flex-row items-center gap-3 rounded border border-gold/15 bg-black/40 p-3"
            >
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === links.length - 1}
                  className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="grid flex-1 gap-3 sm:grid-cols-2 w-full">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...links];
                    if (updated[idx]) {
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setLinks(updated);
                    }
                  }}
                  placeholder="Label (e.g. Home)"
                  className="rounded border border-gold/20 bg-black/60 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => {
                    const updated = [...links];
                    if (updated[idx]) {
                      updated[idx] = { ...updated[idx], href: e.target.value };
                      setLinks(updated);
                    }
                  }}
                  placeholder="Anchor / URL (e.g. #couple)"
                  className="rounded border border-gold/20 bg-black/60 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0">
                <label className="flex items-center gap-1.5 text-xs text-ivory/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.visible ?? true}
                    onChange={(e) => {
                      const updated = [...links];
                      if (updated[idx]) {
                        updated[idx] = { ...updated[idx], visible: e.target.checked };
                        setLinks(updated);
                      }
                    }}
                    className="rounded text-gold focus:ring-gold"
                  />
                  Visible
                </label>
                <button
                  onClick={() => setDeleteIndex(idx)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                  title="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Navigation Link?"
        message="Are you sure you want to remove this navigation item from the header menu?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
