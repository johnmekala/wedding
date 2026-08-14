import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useWeddingData, updateWeddingPath, type HeroData, type IntroData } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { toast } from "sonner";
import { Sparkles, Save, Image as ImageIcon, Video, DoorOpen } from "lucide-react";

export const Route = createFileRoute("/admin/hero")({
  component: AdminHeroCMS,
});

function AdminHeroCMS() {
  const data = useWeddingData();
  const [heroForm, setHeroForm] = useState<HeroData>(data.hero);
  const [introForm, setIntroForm] = useState<IntroData>(data.intro);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setHeroForm(data.hero);
      setIntroForm(data.intro);
    }
  }, [data.loading, data.hero, data.intro]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateWeddingPath("hero", heroForm);
      await updateWeddingPath("intro", introForm);
      toast.success("Hero & Temple Door Intro updated successfully!");
    } catch (err: any) {
      console.error("Save hero error:", err);
      toast.error("Failed to update Hero & Intro content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold" /> Hero &amp; Temple Intro CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage the temple door intro screen, Ganesha blessing, and main cinematic hero section
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Content"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Temple Door Intro Screen */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6">
          <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-gold" /> Opening Temple Door Screen
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-caps text-xs text-gold/80">Host Invitation Line / Title</label>
              <input
                type="text"
                value={introForm.title}
                onChange={(e) => setIntroForm({ ...introForm, title: e.target.value })}
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="label-caps text-xs text-gold/80">Subtitle</label>
              <input
                type="text"
                value={introForm.subtitle}
                onChange={(e) => setIntroForm({ ...introForm, subtitle: e.target.value })}
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label-caps text-xs text-gold/80">Opening Status Text</label>
              <input
                type="text"
                value={introForm.openingText || ""}
                onChange={(e) => setIntroForm({ ...introForm, openingText: e.target.value })}
                placeholder="Opening shortly…"
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="label-caps text-xs text-gold/80">Celebration Prefix Line</label>
              <input
                type="text"
                value={introForm.celebrationPrefix || ""}
                onChange={(e) => setIntroForm({ ...introForm, celebrationPrefix: e.target.value })}
                placeholder="A Celebration of"
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="label-caps text-xs text-gold/80">Door Reveal Welcome Text</label>
              <input
                type="text"
                value={introForm.welcomeText || ""}
                onChange={(e) => setIntroForm({ ...introForm, welcomeText: e.target.value })}
                placeholder="Welcome to our celebration"
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label-caps text-xs text-gold/80">Date Label</label>
              <input
                type="text"
                value={introForm.dateText}
                onChange={(e) => setIntroForm({ ...introForm, dateText: e.target.value })}
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="label-caps text-xs text-gold/80">City / Location</label>
              <input
                type="text"
                value={introForm.locationText}
                onChange={(e) => setIntroForm({ ...introForm, locationText: e.target.value })}
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="label-caps text-xs text-gold/80">Enter Button Text</label>
              <input
                type="text"
                value={introForm.buttonText}
                onChange={(e) => setIntroForm({ ...introForm, buttonText: e.target.value })}
                className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <MediaPickerInput
            label="Intro Ganesha Idol Image"
            value={introForm.ganeshaImage}
            onChange={(url) => setIntroForm({ ...introForm, ganeshaImage: url })}
            helpText="Sacred Ganesha icon shown on temple doors and entrance screen"
          />
        </div>

        {/* Hero Layout Selection & Media Controls */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6">
          <h3 className="font-display text-xl text-gold-light flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-gold" /> Hero Section Layout Selection
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setHeroForm({ ...heroForm, layout: "existing" })}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                (heroForm.layout || "existing") === "existing"
                  ? "border-gold bg-gold/15 text-gold-light shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                  : "border-gold/20 bg-black/40 text-ivory/70 hover:border-gold/40"
              }`}
            >
              <div className="flex items-center gap-2 font-display text-base font-semibold">
                <input
                  type="radio"
                  name="heroLayout"
                  checked={(heroForm.layout || "existing") === "existing"}
                  onChange={() => setHeroForm({ ...heroForm, layout: "existing" })}
                  className="accent-gold"
                />
                Existing Full-Frame Hero
              </div>
              <p className="mt-1.5 text-xs text-ivory/60 leading-relaxed">
                Full-screen background couple photograph/video with overlay typography card.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setHeroForm({ ...heroForm, layout: "media-trio" })}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                heroForm.layout === "media-trio"
                  ? "border-gold bg-gold/15 text-gold-light shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                  : "border-gold/20 bg-black/40 text-ivory/70 hover:border-gold/40"
              }`}
            >
              <div className="flex items-center gap-2 font-display text-base font-semibold">
                <input
                  type="radio"
                  name="heroLayout"
                  checked={heroForm.layout === "media-trio"}
                  onChange={() => setHeroForm({ ...heroForm, layout: "media-trio" })}
                  className="accent-gold"
                />
                Video + Left Image + Right Image
              </div>
              <p className="mt-1.5 text-xs text-ivory/60 leading-relaxed">
                3-Media composition featuring a prominent center video flanked by left &amp; right framed photos.
              </p>
            </button>
          </div>

          {/* Controls for Existing Hero Layout */}
          {(heroForm.layout || "existing") === "existing" && (
            <div className="space-y-6 pt-4 border-t border-gold/15">
              <h4 className="label-caps text-xs text-gold/80">Existing Hero Media Options</h4>
              <MediaPickerInput
                label="Main Couple Hero Photo (Desktop & Tablet)"
                value={heroForm.heroImage}
                onChange={(url) => setHeroForm({ ...heroForm, heroImage: url })}
                helpText="Full-frame photograph rendered in Cinematic Hero background"
              />

              <MediaPickerInput
                label="Hero Video URL (Optional Cinematic MP4/WEBM)"
                value={heroForm.heroVideoUrl || ""}
                onChange={(url) => setHeroForm({ ...heroForm, heroVideoUrl: url })}
                isVideo
                helpText="If provided, auto-plays silently as background video in hero section"
              />
            </div>
          )}

          {/* Controls for Media Trio Layout */}
          {heroForm.layout === "media-trio" && (
            <div className="space-y-6 pt-4 border-t border-gold/15">
              <h4 className="label-caps text-xs text-gold-light">Media Trio Configuration (Left Image + Center Video + Right Image)</h4>

              {/* Left Image */}
              <div className="rounded-lg border border-gold/20 bg-black/40 p-4 space-y-4">
                <h5 className="font-display text-sm text-gold-light">Left Image</h5>
                <MediaPickerInput
                  label="Left Image URL / Upload"
                  value={heroForm.leftImage?.url || ""}
                  onChange={(url) =>
                    setHeroForm({
                      ...heroForm,
                      leftImage: { ...(heroForm.leftImage || {}), url },
                    })
                  }
                  helpText="Left side framed portrait photo"
                />
                <div>
                  <label className="label-caps text-xs text-gold/80 mb-1 block">Left Image Alt Text / Label</label>
                  <input
                    type="text"
                    value={heroForm.leftImage?.alt || ""}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        leftImage: { ...(heroForm.leftImage || {}), url: heroForm.leftImage?.url || "", alt: e.target.value },
                      })
                    }
                    placeholder="Bride Sriya"
                    className="w-full rounded border border-gold/25 bg-black/50 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Center Video */}
              <div className="rounded-lg border border-gold/20 bg-black/40 p-4 space-y-4">
                <h5 className="font-display text-sm text-gold-light flex items-center gap-2">
                  <Video className="h-4 w-4 text-gold" /> Center Focal Video
                </h5>
                <MediaPickerInput
                  label="Center Video URL / Upload (MP4 / WebM)"
                  value={heroForm.centerVideo?.url || ""}
                  onChange={(url) =>
                    setHeroForm({
                      ...heroForm,
                      centerVideo: { ...(heroForm.centerVideo || {}), url },
                    })
                  }
                  isVideo
                  helpText="Main focal video displayed in center"
                />
                <MediaPickerInput
                  label="Center Video Poster / Thumbnail Image"
                  value={heroForm.centerVideo?.poster || ""}
                  onChange={(url) =>
                    setHeroForm({
                      ...heroForm,
                      centerVideo: { ...(heroForm.centerVideo || {}), poster: url },
                    })
                  }
                  helpText="Image shown while video is loading or as fallback"
                />

                <div className="pt-2">
                  <label className="label-caps text-xs text-gold/80 mb-2 block">Video Fitting Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setHeroForm({
                          ...heroForm,
                          centerVideo: { ...(heroForm.centerVideo || {}), objectFit: "contain" },
                        })
                      }
                      className={`flex items-center gap-2 rounded border p-2.5 text-xs transition-all ${
                        (heroForm.centerVideo?.objectFit || "contain") === "contain"
                          ? "border-gold bg-gold/20 text-gold-light"
                          : "border-gold/20 bg-black/40 text-ivory/60 hover:border-gold/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="videoObjectFit"
                        checked={(heroForm.centerVideo?.objectFit || "contain") === "contain"}
                        onChange={() =>
                          setHeroForm({
                            ...heroForm,
                            centerVideo: { ...(heroForm.centerVideo || {}), objectFit: "contain" },
                          })
                        }
                        className="accent-gold"
                      />
                      Fit to Screen (No Cropping)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroForm({
                          ...heroForm,
                          centerVideo: { ...(heroForm.centerVideo || {}), objectFit: "cover" },
                        })
                      }
                      className={`flex items-center gap-2 rounded border p-2.5 text-xs transition-all ${
                        heroForm.centerVideo?.objectFit === "cover"
                          ? "border-gold bg-gold/20 text-gold-light"
                          : "border-gold/20 bg-black/40 text-ivory/60 hover:border-gold/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="videoObjectFit"
                        checked={heroForm.centerVideo?.objectFit === "cover"}
                        onChange={() =>
                          setHeroForm({
                            ...heroForm,
                            centerVideo: { ...(heroForm.centerVideo || {}), objectFit: "cover" },
                          })
                        }
                        className="accent-gold"
                      />
                      Fill Frame (Cover)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-ivory/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.centerVideo?.autoplay ?? true}
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          centerVideo: { ...(heroForm.centerVideo || {}), autoplay: e.target.checked },
                        })
                      }
                      className="accent-gold"
                    />
                    Autoplay
                  </label>
                  <label className="flex items-center gap-2 text-xs text-ivory/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.centerVideo?.muted ?? true}
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          centerVideo: { ...(heroForm.centerVideo || {}), muted: e.target.checked },
                        })
                      }
                      className="accent-gold"
                    />
                    Muted
                  </label>
                  <label className="flex items-center gap-2 text-xs text-ivory/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.centerVideo?.loop ?? true}
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          centerVideo: { ...(heroForm.centerVideo || {}), loop: e.target.checked },
                        })
                      }
                      className="accent-gold"
                    />
                    Loop
                  </label>
                  <label className="flex items-center gap-2 text-xs text-ivory/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.centerVideo?.playsInline ?? true}
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          centerVideo: { ...(heroForm.centerVideo || {}), playsInline: e.target.checked },
                        })
                      }
                      className="accent-gold"
                    />
                    Plays Inline
                  </label>
                </div>
              </div>

              {/* Right Image */}
              <div className="rounded-lg border border-gold/20 bg-black/40 p-4 space-y-4">
                <h5 className="font-display text-sm text-gold-light">Right Image</h5>
                <MediaPickerInput
                  label="Right Image URL / Upload"
                  value={heroForm.rightImage?.url || ""}
                  onChange={(url) =>
                    setHeroForm({
                      ...heroForm,
                      rightImage: { ...(heroForm.rightImage || {}), url },
                    })
                  }
                  helpText="Right side framed portrait photo"
                />
                <div>
                  <label className="label-caps text-xs text-gold/80 mb-1 block">Right Image Alt Text / Label</label>
                  <input
                    type="text"
                    value={heroForm.rightImage?.alt || ""}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        rightImage: { ...(heroForm.rightImage || {}), url: heroForm.rightImage?.url || "", alt: e.target.value },
                      })
                    }
                    placeholder="Groom Janak"
                    className="w-full rounded border border-gold/25 bg-black/50 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wording & Names */}
        <div className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6">
          <h3 className="font-display text-xl text-gold-light">Hero Invitation Text</h3>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block label-caps text-gold-light mb-2">Blessing Line (Top)</label>
              <input
                type="text"
                value={heroForm.blessingText || ""}
                onChange={(e) => setHeroForm({ ...heroForm, blessingText: e.target.value })}
                placeholder="With the blessings of Lord Ganesha"
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-2">Welcome Line (Subheading)</label>
              <input
                type="text"
                value={heroForm.welcomeText || ""}
                onChange={(e) => setHeroForm({ ...heroForm, welcomeText: e.target.value })}
                placeholder="Welcome to the Wedding Celebration of"
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block label-caps text-gold-light mb-2">Bride Name</label>
              <input
                type="text"
                value={heroForm.brideName}
                onChange={(e) => setHeroForm({ ...heroForm, brideName: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-2">Groom Name</label>
              <input
                type="text"
                value={heroForm.groomName}
                onChange={(e) => setHeroForm({ ...heroForm, groomName: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block label-caps text-gold-light mb-2">Date Display Text</label>
              <input
                type="text"
                value={heroForm.dateText}
                onChange={(e) => setHeroForm({ ...heroForm, dateText: e.target.value })}
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block label-caps text-gold-light mb-2">Scroll Indicator Label</label>
              <input
                type="text"
                value={heroForm.scrollText || ""}
                onChange={(e) => setHeroForm({ ...heroForm, scrollText: e.target.value })}
                placeholder="Scroll"
                className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block label-caps text-gold-light mb-2">Invitation Subheading / Note</label>
            <textarea
              rows={2}
              value={heroForm.subheading}
              onChange={(e) => setHeroForm({ ...heroForm, subheading: e.target.value })}
              className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
            />
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
            {saving ? "Saving Changes…" : "Save Hero & Intro Content"}
          </button>
        </div>
      </form>
    </div>
  );
}
