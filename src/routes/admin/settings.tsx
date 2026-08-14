import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useWeddingData, updateWeddingPath, type WeddingSettings, type SEOData } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { toast } from "sonner";
import { Sliders, Save, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsCMS,
});

function AdminSettingsCMS() {
  const data = useWeddingData();
  const [settings, setSettings] = useState<WeddingSettings>(data.settings);
  const [seo, setSeo] = useState<SEOData>(data.seo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setSettings(data.settings);
      setSeo(data.seo);
    }
  }, [data.loading, data.settings, data.seo]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateWeddingPath("settings", settings);
      await updateWeddingPath("seo", seo);
      toast.success("Wedding metadata & SEO settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Sliders className="h-6 w-6 text-gold" /> SEO &amp; Site Settings CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage global metadata, sumuhurtham timing ISO strings, search engine titles, and social share previews
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6">
          <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
            <Sliders className="h-5 w-5 text-gold" /> General Invitation Wording &amp; Timer
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block label-caps text-gold-light mb-1">Invocation Text</label>
              <input
                type="text"
                value={settings.invocation}
                onChange={(e) => setSettings({ ...settings, invocation: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block label-caps text-gold-light mb-1">Wedding Date Label</label>
              <input
                type="text"
                value={settings.weddingDateLabel}
                onChange={(e) => setSettings({ ...settings, weddingDateLabel: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-1">Sumuhurtham Wording</label>
              <input
                type="text"
                value={settings.sumuhurtham}
                onChange={(e) => setSettings({ ...settings, sumuhurtham: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-1">City</label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory"
              />
            </div>
          </div>

          <div>
            <label className="block label-caps text-gold-light mb-1">Countdown Timer Target ISO Date</label>
            <input
              type="text"
              value={settings.weddingISO}
              onChange={(e) => setSettings({ ...settings, weddingISO: e.target.value })}
              placeholder="2026-08-27T11:07:00+05:30"
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none font-mono"
            />
            <p className="text-[0.7rem] text-ivory/50 mt-1 italic">
              ISO timestamp parsed by countdown clock component (e.g. 2026-08-27T11:07:00+05:30)
            </p>
          </div>
        </div>

        {/* SEO Management */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6">
          <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
            <Globe className="h-5 w-5 text-gold" /> Search Engine &amp; Open Graph (SEO)
          </h3>

          <div>
            <label className="block label-caps text-gold-light mb-1">Page / Site Title</label>
            <input
              type="text"
              value={seo.siteTitle || ""}
              onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block label-caps text-gold-light mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={seo.metaDescription || ""}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block label-caps text-gold-light mb-1">Meta Keywords</label>
            <input
              type="text"
              value={seo.keywords || ""}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          <MediaPickerInput
            label="Open Graph / Social Sharing Image (OG Image)"
            value={seo.ogImage || ""}
            onChange={(url) => setSeo({ ...seo, ogImage: url })}
            helpText="Image thumbnail shown when website link is shared on WhatsApp, Facebook, or iMessage"
          />

          <div>
            <label className="block label-caps text-gold-light mb-1">Canonical URL</label>
            <input
              type="url"
              value={seo.canonicalUrl || ""}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded bg-gradient-to-r from-gold-deep via-gold to-gold-deep px-8 py-3.5 font-heading text-sm uppercase tracking-[0.2em] text-maroon-deep font-medium hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Settings…" : "Save All SEO & Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
