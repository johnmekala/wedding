import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath, type SpecialBlessingImageItem } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Users2, Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/family")({
  component: AdminFamilyCMS,
});

function AdminFamilyCMS() {
  const data = useWeddingData();
  const [family, setFamily] = useState(data.family);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setFamily(data.family);
    }
  }, [data.loading, data.family]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWeddingPath("family", family);
      toast.success("Family blessings & host info saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save family details");
    } finally {
      setSaving(false);
    }
  };

  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);

  const specialBlessingsData = family.specialBlessingsImages || {
    enabled: true,
    sectionTitle: "SPECIAL BLESSINGS",
    items: [],
  };

  const sbItems = specialBlessingsData.items || [];

  const handleAddSpecialBlessingImage = () => {
    const newImg: SpecialBlessingImageItem = {
      id: Date.now().toString(),
      url: "/images/yay.jpg",
      alt: "Special Blessing Visual",
      enabled: true,
      order: sbItems.length + 1,
    };
    setFamily({
      ...family,
      specialBlessingsImages: {
        ...specialBlessingsData,
        items: [newImg, ...sbItems],
      },
    });
    toast.info("New Special Blessing Image added. Save changes when ready.");
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const items = [...sbItems];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const moved = items.splice(index, 1)[0];
    if (moved) {
      items.splice(target, 0, moved);
      setFamily({
        ...family,
        specialBlessingsImages: {
          ...specialBlessingsData,
          items,
        },
      });
    }
  };

  const handleToggleImageVisibility = (index: number) => {
    const updated = sbItems.map((it, i) =>
      i === index ? { ...it, enabled: it.enabled === false ? true : false } : it
    );
    setFamily({
      ...family,
      specialBlessingsImages: {
        ...specialBlessingsData,
        items: updated,
      },
    });
  };

  const confirmDeleteImage = () => {
    if (deleteImageIndex !== null) {
      const updated = sbItems.filter((_, i) => i !== deleteImageIndex);
      setFamily({
        ...family,
        specialBlessingsImages: {
          ...specialBlessingsData,
          items: updated,
        },
      });
      setDeleteImageIndex(null);
      toast.info("Image removed. Save changes to update RTDB.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Users2 className="h-6 w-6 text-gold" /> Family Blessings CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage wedding hosts, parents, grandparents, regards list, and family invitation messages
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Family Content"}
        </button>
      </div>

      {/* Section Headings & Sacred Introduction Phrases */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-6">
        <h2 className="font-display text-lg text-gold-light">Section Headings &amp; Intro Phrases</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80">Section Small Label</label>
            <input
              type="text"
              value={family.sectionLabel || ""}
              onChange={(e) => setFamily({ ...family, sectionLabel: e.target.value })}
              placeholder="Family Blessings"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Section Main Title</label>
            <input
              type="text"
              value={family.sectionTitle || ""}
              onChange={(e) => setFamily({ ...family, sectionTitle: e.target.value })}
              placeholder="Two Families, One Beginning"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-caps text-xs text-gold/80">Sacred Introduction 3 Phrases</label>
            <button
              onClick={() => setFamily({ ...family, sacredPhrases: [...(family.sacredPhrases || []), "New Sacred Phrase"] })}
              className="flex items-center gap-1 text-[0.7rem] text-gold hover:underline"
            >
              <Plus className="h-3 w-3" /> Add Phrase
            </button>
          </div>
          <div className="space-y-2">
            {(family.sacredPhrases || ["Two families.", "Two journeys.", "One sacred union."]).map((phrase, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => {
                    const updated = [...(family.sacredPhrases || [])];
                    updated[i] = e.target.value;
                    setFamily({ ...family, sacredPhrases: updated });
                  }}
                  className="flex-1 rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
                <button
                  onClick={() => {
                    const updated = [...(family.sacredPhrases || [])];
                    updated.splice(i, 1);
                    setFamily({ ...family, sacredPhrases: updated });
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

      {/* ── Special Blessings Image (single, above family content) ── */}
      <div className="rounded-lg border border-gold/30 bg-nearblack/60 p-6 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gold/15 pb-4">
          <div>
            <h2 className="font-display text-lg text-gold-light flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gold" /> Special Blessings Image
            </h2>
            <p className="text-xs text-ivory/60 mt-0.5">
              Single image displayed above the Family Blessings content on the website
            </p>
          </div>

          {/* Show / Hide toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs text-gold-light">Show on website:</span>
            <input
              type="checkbox"
              checked={family.specialBlessingsTopImage?.enabled !== false}
              onChange={(e) =>
                setFamily({
                  ...family,
                  specialBlessingsTopImage: {
                    ...(family.specialBlessingsTopImage || {}),
                    enabled: e.target.checked,
                  },
                })
              }
              className="accent-gold h-4 w-4"
            />
            <span className="text-xs font-semibold text-gold-light">
              {family.specialBlessingsTopImage?.enabled !== false ? "ON" : "OFF"}
            </span>
          </label>
        </div>

        {/* Image preview */}
        {family.specialBlessingsTopImage?.image && (
          <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-gold/30">
            <img
              src={family.specialBlessingsTopImage.image}
              alt="Special Blessings preview"
              className="w-full object-contain max-h-64"
            />
          </div>
        )}

        {/* Upload / Replace Image */}
        <MediaPickerInput
          label={family.specialBlessingsTopImage?.image ? "Replace Image" : "Upload Image"}
          value={family.specialBlessingsTopImage?.image || ""}
          onChange={(url) =>
            setFamily({
              ...family,
              specialBlessingsTopImage: {
                ...(family.specialBlessingsTopImage || {}),
                enabled: family.specialBlessingsTopImage?.enabled !== false,
                image: url,
              },
            })
          }
          helpText="Upload via Media Library (Cloudinary). Only permanent HTTPS URLs are saved."
        />

        {/* Remove Image */}
        {family.specialBlessingsTopImage?.image && (
          <button
            type="button"
            onClick={() =>
              setFamily({
                ...family,
                specialBlessingsTopImage: {
                  ...(family.specialBlessingsTopImage || {}),
                  image: "",
                },
              })
            }
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded px-2 py-1 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove Image
          </button>
        )}

        <p className="text-[0.65rem] text-ivory/40 leading-relaxed">
          Hit <span className="text-gold font-semibold">Save Family Content</span> after making changes.
        </p>
      </div>
      {/* ──────────────────────────────────────────────────────────── */}

      {/* Hosts & Parents */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-6">
        <h2 className="font-display text-lg text-gold-light">Wedding Hosts &amp; Parents</h2>

        <MediaPickerInput
          label="Family Group Photograph"
          value={family.photo || ""}
          onChange={(url) => setFamily({ ...family, photo: url })}
          helpText="Main photo of both families displayed in Family Blessings section"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80">Bride's Family Card Title</label>
            <input
              type="text"
              value={family.brideFamilyLabel || ""}
              onChange={(e) => setFamily({ ...family, brideFamilyLabel: e.target.value })}
              placeholder="The Bride's Family"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Groom's Family Card Title</label>
            <input
              type="text"
              value={family.groomFamilyLabel || ""}
              onChange={(e) => setFamily({ ...family, groomFamilyLabel: e.target.value })}
              placeholder="The Groom's Family"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80">Hosts Invitation Line</label>
          <textarea
            rows={2}
            value={family.hostsLine || ""}
            onChange={(e) => setFamily({ ...family, hostsLine: e.target.value })}
            className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80">Bride's Parents (Hosts)</label>
          <div className="space-y-2 mt-1">
            {(family.hosts || []).map((host, i) => (
              <input
                key={i}
                type="text"
                value={host}
                onChange={(e) => {
                  const updated = [...family.hosts];
                  updated[i] = e.target.value;
                  setFamily({ ...family, hosts: updated });
                }}
                className="w-full rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80">Groom's Parents Line</label>
          <input
            type="text"
            value={family.groomParents || ""}
            onChange={(e) => setFamily({ ...family, groomParents: e.target.value })}
            className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Grandparents */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-6">
        <h2 className="font-display text-lg text-gold-light">Grandparents Blessings</h2>

        <div>
          <label className="label-caps text-xs text-gold/80">Bride's Grandparents Lines</label>
          <div className="space-y-2 mt-1">
            {(family.brideGrand || []).map((line, i) => (
              <input
                key={i}
                type="text"
                value={line}
                onChange={(e) => {
                  const updated = [...family.brideGrand];
                  updated[i] = e.target.value;
                  setFamily({ ...family, brideGrand: updated });
                }}
                className="w-full rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80">Groom's Grandparents Lines</label>
          <div className="space-y-2 mt-1">
            {(family.groomGrand || []).map((line, i) => (
              <input
                key={i}
                type="text"
                value={line}
                onChange={(e) => {
                  const updated = [...family.groomGrand];
                  updated[i] = e.target.value;
                  setFamily({ ...family, groomGrand: updated });
                }}
                className="w-full rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Final Invitation & Warm Regards */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-6">
        <h2 className="font-display text-lg text-gold-light">Final Invitation Section</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80">Final Section Label</label>
            <input
              type="text"
              value={family.finalInvitationLabel || ""}
              onChange={(e) => setFamily({ ...family, finalInvitationLabel: e.target.value })}
              placeholder="Final Invitation"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Final Section Main Title</label>
            <input
              type="text"
              value={family.finalInvitationTitle || ""}
              onChange={(e) => setFamily({ ...family, finalInvitationTitle: e.target.value })}
              placeholder="Your Presence Is Our Blessing"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80">Regards Section Heading</label>
          <input
            type="text"
            value={family.regardsTitle || ""}
            onChange={(e) => setFamily({ ...family, regardsTitle: e.target.value })}
            placeholder="Warm Regards"
            className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-caps text-xs text-gold/80">Warm Regards List</label>
            <button
              onClick={() => setFamily({ ...family, regards: [...(family.regards || []), "New Member Name"] })}
              className="flex items-center gap-1 text-[0.7rem] text-gold hover:underline"
            >
              <Plus className="h-3 w-3" /> Add Name
            </button>
          </div>
          <div className="space-y-2">
            {(family.regards || []).map((name, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const updated = [...family.regards];
                    updated[i] = e.target.value;
                    setFamily({ ...family, regards: updated });
                  }}
                  className="flex-1 rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
                <button
                  onClick={() => {
                    const updated = [...family.regards];
                    updated.splice(i, 1);
                    setFamily({ ...family, regards: updated });
                  }}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80">Final Closing Invitation Paragraphs</label>
          <div className="space-y-2 mt-1">
            {(family.closingMessage || []).map((paragraph, i) => (
              <textarea
                key={i}
                rows={2}
                value={paragraph}
                onChange={(e) => {
                  const updated = [...family.closingMessage];
                  updated[i] = e.target.value;
                  setFamily({ ...family, closingMessage: updated });
                }}
                className="w-full rounded border border-gold/20 bg-black/50 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Special Blessings Images Subsection CMS */}
      <div className="rounded-lg border border-gold/30 bg-nearblack/60 p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gold/15 pb-4">
          <div>
            <h2 className="font-display text-lg text-gold-light flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gold" /> Special Blessings Images
            </h2>
            <p className="text-xs text-ivory/60">
              Manage large full-width cinematic images displayed inside Family Blessings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gold-light">
              <span>Section:</span>
              <input
                type="checkbox"
                checked={specialBlessingsData.enabled !== false}
                onChange={(e) =>
                  setFamily({
                    ...family,
                    specialBlessingsImages: { ...specialBlessingsData, enabled: e.target.checked },
                  })
                }
                className="accent-gold h-4 w-4"
              />
              <span className="font-semibold">{specialBlessingsData.enabled !== false ? "ON" : "OFF"}</span>
            </label>

            <button
              onClick={handleAddSpecialBlessingImage}
              className="flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs text-gold-light hover:bg-gold/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Image
            </button>
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80 block mb-1">Subsection Heading Title</label>
          <input
            type="text"
            value={specialBlessingsData.sectionTitle || ""}
            onChange={(e) =>
              setFamily({
                ...family,
                specialBlessingsImages: { ...specialBlessingsData, sectionTitle: e.target.value },
              })
            }
            placeholder="SPECIAL BLESSINGS"
            className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        {/* List of Special Blessing Images */}
        <div className="space-y-4 pt-2">
          <h3 className="label-caps text-xs text-gold/80">Images List ({sbItems.length})</h3>

          {sbItems.length === 0 ? (
            <div className="rounded border border-dashed border-gold/25 p-6 text-center text-xs text-ivory/60">
              No special blessing images added. Click &quot;+ Add Image&quot; above.
            </div>
          ) : (
            sbItems.map((imgItem, idx) => (
              <div
                key={imgItem.id || idx}
                className={`rounded-lg border bg-black/40 p-4 space-y-3 transition-all ${
                  imgItem.enabled === false ? "border-gold/15 opacity-60" : "border-gold/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 font-mono text-xs text-gold">
                      #{idx + 1}
                    </span>
                    <span className="text-xs text-ivory font-medium">Image #{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveImage(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveImage(idx, "down")}
                      disabled={idx === sbItems.length - 1}
                      className="p-1 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleImageVisibility(idx)}
                      className="p-1 text-ivory/70 hover:bg-gold/10 hover:text-gold rounded"
                      title={imgItem.enabled === false ? "Enable image" : "Disable image"}
                    >
                      {imgItem.enabled === false ? (
                        <EyeOff className="h-4 w-4 text-rose-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-emerald-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteImageIndex(idx)}
                      className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                      title="Delete image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <MediaPickerInput
                  label="Full-Width Cinematic Image URL / Upload"
                  value={imgItem.url || ""}
                  onChange={(url) => {
                    const updated = sbItems.map((it, i) => (i === idx ? { ...it, url } : it));
                    setFamily({
                      ...family,
                      specialBlessingsImages: { ...specialBlessingsData, items: updated },
                    });
                  }}
                  helpText="High-resolution image rendered edge-to-edge inside Special Blessings"
                />

                <div>
                  <label className="label-caps text-xs text-gold/80 block mb-1">Alt Text (Optional)</label>
                  <input
                    type="text"
                    value={imgItem.alt || ""}
                    onChange={(e) => {
                      const updated = sbItems.map((it, i) => (i === idx ? { ...it, alt: e.target.value } : it));
                      setFamily({
                        ...family,
                        specialBlessingsImages: { ...specialBlessingsData, items: updated },
                      });
                    }}
                    placeholder="e.g. Special Blessing Ceremony Visual"
                    className="w-full rounded border border-gold/25 bg-black/40 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteImageIndex !== null && (
        <DeleteConfirmModal
          isOpen={true}
          title="Delete Special Blessing Image?"
          message="Are you sure you want to remove this image? Click 'Save Family Content' afterwards to update RTDB."
          onConfirm={confirmDeleteImage}
          onCancel={() => setDeleteImageIndex(null)}
        />
      )}
    </div>
  );
}
