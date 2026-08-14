import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath, type QuoteData } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { Quote, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotesCMS,
});

function AdminQuotesCMS() {
  const data = useWeddingData();
  const [quotes, setQuotes] = useState<QuoteData>(data.quotes);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setQuotes(data.quotes);
    }
  }, [data.loading, data.quotes]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWeddingPath("quotes", quotes);
      toast.success("Quotes & Moments text updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save quotes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Quote className="h-6 w-6 text-gold" /> Quotes &amp; Moments CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage full-width quote photo sections, cinematic breaks, and sacred lines
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Quotes"}
        </button>
      </div>

      {/* Intro Quote */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Sacred Introduction Quote</h2>
        <textarea
          rows={2}
          value={quotes.introQuote || ""}
          onChange={(e) => setQuotes({ ...quotes, introQuote: e.target.value })}
          className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>

      {/* Quote Photo 1 */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Cinematic Break 1 — "Where tradition meets forever"</h2>
        <div>
          <label className="label-caps text-xs text-gold/80 mb-1 block">Quote Wording</label>
          <input
            type="text"
            value={quotes.mesmarizingQuote || ""}
            onChange={(e) => setQuotes({ ...quotes, mesmarizingQuote: e.target.value })}
            className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <MediaPickerInput
          label="Background Photo"
          value={quotes.mesmarizingImg || ""}
          onChange={(url) => setQuotes({ ...quotes, mesmarizingImg: url })}
        />
      </div>

      {/* Quote Photo 2 */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Cinematic Break 2 — "Two families, one beautiful beginning"</h2>
        <div>
          <label className="label-caps text-xs text-gold/80 mb-1 block">Quote Wording</label>
          <input
            type="text"
            value={quotes.ringQuote || ""}
            onChange={(e) => setQuotes({ ...quotes, ringQuote: e.target.value })}
            className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <MediaPickerInput
          label="Background Photo"
          value={quotes.ringImg || ""}
          onChange={(url) => setQuotes({ ...quotes, ringImg: url })}
        />
      </div>

      {/* Quote Photo 3 */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Cinematic Break 3 — "Some moments become memories..."</h2>
        <div>
          <label className="label-caps text-xs text-gold/80 mb-1 block">Quote Wording</label>
          <input
            type="text"
            value={quotes.aMomentQuote || ""}
            onChange={(e) => setQuotes({ ...quotes, aMomentQuote: e.target.value })}
            className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>
        <MediaPickerInput
          label="Background Photo"
          value={quotes.aMomentImg || ""}
          onChange={(url) => setQuotes({ ...quotes, aMomentImg: url })}
        />
      </div>

      {/* Sacred Moment Background Photo & Lines */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Sacred Moment Full-Screen Photo &amp; Lines</h2>
        
        <MediaPickerInput
          label="Sacred Moment Background Photo"
          value={quotes.yesImg || ""}
          onChange={(url) => setQuotes({ ...quotes, yesImg: url })}
          helpText="Full-screen photo rendered behind the sacred moment sequence lines"
        />

        <div className="flex items-center justify-between pt-2">
          <h3 className="label-caps text-xs text-gold/80">Sacred Moment Sequence Lines</h3>
          <button
            onClick={() => setQuotes({ ...quotes, sacredMomentLines: [...(quotes.sacredMomentLines || []), "New Sacred Line"] })}
            className="flex items-center gap-1 text-[0.7rem] text-gold hover:underline"
          >
            <Plus className="h-3 w-3" /> Add Line
          </button>
        </div>
        <div className="space-y-2">
          {(quotes.sacredMomentLines || []).map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={line}
                onChange={(e) => {
                  const updated = [...quotes.sacredMomentLines];
                  updated[i] = e.target.value;
                  setQuotes({ ...quotes, sacredMomentLines: updated });
                }}
                className="flex-1 rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
              />
              <button
                onClick={() => {
                  const updated = [...quotes.sacredMomentLines];
                  updated.splice(i, 1);
                  setQuotes({ ...quotes, sacredMomentLines: updated });
                }}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
