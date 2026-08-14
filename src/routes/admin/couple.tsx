import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useWeddingData, updateWeddingPath, type CoupleData } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { toast } from "sonner";
import { Heart, Save, User } from "lucide-react";

export const Route = createFileRoute("/admin/couple")({
  component: AdminCoupleCMS,
});

function AdminCoupleCMS() {
  const data = useWeddingData();
  const [couple, setCouple] = useState<CoupleData>(data.couple);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setCouple(data.couple);
    }
  }, [data.loading, data.couple]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateWeddingPath("couple", couple);
      toast.success("Couple profiles & story updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save couple content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Heart className="h-6 w-6 text-gold" /> Couple Profiles &amp; Story CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage the Bride &amp; Groom details, photos, and love story summary
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profiles"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Bride & Groom Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Bride */}
          <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-4">
            <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
              <User className="h-5 w-5 text-gold" /> The Bride
            </h3>

            <div>
              <label className="block label-caps text-gold-light mb-1">Bride Name</label>
              <input
                type="text"
                value={couple.bride.name}
                onChange={(e) =>
                  setCouple({ ...couple, bride: { ...couple.bride, name: e.target.value } })
                }
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-1">Education / Qualification</label>
              <input
                type="text"
                value={couple.bride.detail}
                onChange={(e) =>
                  setCouple({ ...couple, bride: { ...couple.bride, detail: e.target.value } })
                }
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <MediaPickerInput
              label="Bride Portrait Photo"
              value={couple.bride.photo}
              onChange={(url) =>
                setCouple({ ...couple, bride: { ...couple.bride, photo: url } })
              }
              helpText="Vertical portrait photograph of Sriya"
            />
          </div>

          {/* Groom */}
          <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-4">
            <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
              <User className="h-5 w-5 text-gold" /> The Groom
            </h3>

            <div>
              <label className="block label-caps text-gold-light mb-1">Groom Name</label>
              <input
                type="text"
                value={couple.groom.name}
                onChange={(e) =>
                  setCouple({ ...couple, groom: { ...couple.groom, name: e.target.value } })
                }
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-1">Education / Qualification</label>
              <input
                type="text"
                value={couple.groom.detail}
                onChange={(e) =>
                  setCouple({ ...couple, groom: { ...couple.groom, detail: e.target.value } })
                }
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <MediaPickerInput
              label="Groom Portrait Photo"
              value={couple.groom.photo}
              onChange={(url) =>
                setCouple({ ...couple, groom: { ...couple.groom, photo: url } })
              }
              helpText="Vertical portrait photograph of Janak"
            />
          </div>
        </div>

        {/* Love Story Summary & Section Wording */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-4">
          <h3 className="font-display text-xl text-gold-light">Section Titles &amp; Wording</h3>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block label-caps text-gold-light mb-1">Section Small Label</label>
              <input
                type="text"
                value={couple.sectionLabel || ""}
                onChange={(e) => setCouple({ ...couple, sectionLabel: e.target.value })}
                placeholder="The Couple"
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block label-caps text-gold-light mb-1">Section Main Title</label>
              <input
                type="text"
                value={couple.sectionTitle || ""}
                onChange={(e) => setCouple({ ...couple, sectionTitle: e.target.value })}
                placeholder="Hamsini Sriya & S. V. Janak"
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block label-caps text-gold-light mb-1">Monogram Connector Word</label>
              <input
                type="text"
                value={couple.monogramWord || ""}
                onChange={(e) => setCouple({ ...couple, monogramWord: e.target.value })}
                placeholder="with"
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block label-caps text-gold-light mb-1">Love Story Tagline</label>
            <textarea
              rows={2}
              value={couple.story}
              onChange={(e) => setCouple({ ...couple, story: e.target.value })}
              placeholder="Two journeys. One sacred union."
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
            <p className="text-[0.7rem] text-ivory/50 mt-1 italic">
              Displayed as introduction text beneath the couple reveal section
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded bg-gradient-to-r from-gold-deep via-gold to-gold-deep px-8 py-3.5 font-heading text-sm uppercase tracking-[0.2em] text-maroon-deep font-medium hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Couple Profiles"}
          </button>
        </div>
      </form>
    </div>
  );
}
