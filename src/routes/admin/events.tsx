import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useWeddingData, updateWeddingPath } from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { WeddingEvent } from "@/data/wedding";
import { toast } from "sonner";
import { CalendarDays, Plus, Trash2, Save, Edit3, X, ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/admin/events")({
  component: AdminEventsCMS,
});

function AdminEventsCMS() {
  const data = useWeddingData();
  const [eventsList, setEventsList] = useState<WeddingEvent[]>(data.events || []);
  const [eventsSection, setEventsSection] = useState(data.eventsSection || {
    sectionLabel: "The Wedding Journey",
    sectionTitle: "Celebration Chapters",
    chapterPrefix: "Chapter",
    viewLocationText: "View Location",
    addToCalendarText: "Add to Calendar",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setEventsList(data.events || []);
      if (data.eventsSection) setEventsSection(data.eventsSection);
    }
  }, [data.loading, data.events, data.eventsSection]);

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await updateWeddingPath("events", eventsList);
      await updateWeddingPath("eventsSection", eventsSection);
      toast.success("All wedding events & section titles saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save events");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = () => {
    const nextNum = (eventsList.length + 1).toString().padStart(2, "0");
    const newEvent: WeddingEvent = {
      index: nextNum,
      title: "New Celebration Event",
      subtitle: "Event Subtitle",
      message: "You are cordially invited to celebrate with us",
      day: "Friday",
      dateNum: "28",
      month: "Aug",
      year: "2026",
      time: "06:00 PM onwards",
      venueName: "Grand Convention",
      venueAddress: "Hyderabad",
      dresscode: "Traditional",
      image: eventsList[0]?.image || "/images/wedding.jpg",
      imagePosition: "50% 30%",
      mood: "sacred",
      mapQuery: "Hyderabad",
    };
    // Added at top by default as required by spec
    const updated = [newEvent, ...eventsList];
    setEventsList(updated);
    setEditingIndex(0);
    toast.info("New event added at the top. Fill details and save.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= eventsList.length) return;
    const updated = [...eventsList];
    const moved = updated.splice(index, 1)[0];
    if (moved) {
      updated.splice(target, 0, moved);
      setEventsList(updated);
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = eventsList.filter((_, i) => i !== deleteIndex);
      setEventsList(updated);
      if (editingIndex === deleteIndex) setEditingIndex(null);
      setDeleteIndex(null);
      toast.info("Event removed. Remember to save changes.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-gold" /> Wedding Events CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Add, edit, reorder, or delete celebration events. Newly added events appear at top.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold-light hover:bg-gold/20 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Event
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All Events"}
          </button>
        </div>
      </div>

      {/* Section Wording & Buttons */}
      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">Events Section Headings &amp; Buttons</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-caps text-xs text-gold/80">Section Small Label</label>
            <input
              type="text"
              value={eventsSection.sectionLabel || ""}
              onChange={(e) => setEventsSection({ ...eventsSection, sectionLabel: e.target.value })}
              placeholder="The Wedding Journey"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Section Main Title</label>
            <input
              type="text"
              value={eventsSection.sectionTitle || ""}
              onChange={(e) => setEventsSection({ ...eventsSection, sectionTitle: e.target.value })}
              placeholder="Celebration Chapters"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Chapter Prefix</label>
            <input
              type="text"
              value={eventsSection.chapterPrefix || ""}
              onChange={(e) => setEventsSection({ ...eventsSection, chapterPrefix: e.target.value })}
              placeholder="Chapter"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80">View Location Button Text</label>
            <input
              type="text"
              value={eventsSection.viewLocationText || ""}
              onChange={(e) => setEventsSection({ ...eventsSection, viewLocationText: e.target.value })}
              placeholder="View Location"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80">Add to Calendar Button Text</label>
            <input
              type="text"
              value={eventsSection.addToCalendarText || ""}
              onChange={(e) => setEventsSection({ ...eventsSection, addToCalendarText: e.target.value })}
              placeholder="Add to Calendar"
              className="mt-1 w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* List of Events */}
      <div className="space-y-6">
        {eventsList.map((e, idx) => {
          const isEditing = editingIndex === idx;
          return (
            <div
              key={e.index + idx}
              className="rounded-lg border border-gold/25 bg-nearblack/60 p-6 space-y-6 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/15 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                      title="Move event up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === eventsList.length - 1}
                      className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                      title="Move event down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-display text-xl text-gold-light">Chapter {e.index}</span>
                  <h3 className="font-display text-lg text-ivory">{e.title}</h3>
                  <span className="label-caps text-xs text-gold-light/60 hidden md:inline">
                    {e.day}, {e.dateNum} {e.month} {e.year}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingIndex(isEditing ? null : idx)}
                    className="flex items-center gap-1 text-xs label-caps text-gold-light hover:text-gold px-3 py-1.5 rounded bg-gold/10 border border-gold/20"
                  >
                    {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                    {isEditing ? "Close" : "Edit Event"}
                  </button>
                  <button
                    onClick={() => setDeleteIndex(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Editing Form */}
              {isEditing ? (
                <div className="grid gap-6 md:grid-cols-2 pt-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block label-caps text-gold-light mb-1">Chapter Index</label>
                      <input
                        type="text"
                        value={e.index}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.index = ev.target.value;
                          setEventsList(updated);
                        }}
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory"
                      />
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Event Title</label>
                      <input
                        type="text"
                        value={e.title}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.title = ev.target.value;
                          setEventsList(updated);
                        }}
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={e.subtitle || ""}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.subtitle = ev.target.value;
                          setEventsList(updated);
                        }}
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Message</label>
                      <textarea
                        rows={2}
                        value={e.message}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.message = ev.target.value;
                          setEventsList(updated);
                        }}
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block label-caps text-gold-light mb-1">Day</label>
                        <input
                          type="text"
                          value={e.day}
                          onChange={(ev) => {
                            const updated = [...eventsList];
                            updated[idx]!.day = ev.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-2.5 py-1.5 text-xs text-ivory"
                        />
                      </div>
                      <div>
                        <label className="block label-caps text-gold-light mb-1">Date</label>
                        <input
                          type="text"
                          value={e.dateNum}
                          onChange={(ev) => {
                            const updated = [...eventsList];
                            updated[idx]!.dateNum = ev.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-2.5 py-1.5 text-xs text-ivory"
                        />
                      </div>
                      <div>
                        <label className="block label-caps text-gold-light mb-1">Month</label>
                        <input
                          type="text"
                          value={e.month}
                          onChange={(ev) => {
                            const updated = [...eventsList];
                            updated[idx]!.month = ev.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-2.5 py-1.5 text-xs text-ivory"
                        />
                      </div>
                      <div>
                        <label className="block label-caps text-gold-light mb-1">Year</label>
                        <input
                          type="text"
                          value={e.year}
                          onChange={(ev) => {
                            const updated = [...eventsList];
                            updated[idx]!.year = ev.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-2.5 py-1.5 text-xs text-ivory"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block label-caps text-gold-light mb-1">Time</label>
                        <input
                          type="text"
                          value={e.time}
                          onChange={(ev) => {
                            const updated = [...eventsList];
                            updated[idx]!.time = ev.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3 py-2 text-sm text-ivory"
                        />
                      </div>
                      <div>
                        <label className="block label-caps text-gold-light mb-1">Dresscode</label>
                        <input
                          type="text"
                          value={e.dresscode}
                          onChange={(ev) => {
                            const updated = [...eventsList];
                            updated[idx]!.dresscode = ev.target.value;
                            setEventsList(updated);
                          }}
                          className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3 py-2 text-sm text-ivory"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={e.venueName}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.venueName = ev.target.value;
                          setEventsList(updated);
                        }}
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory"
                      />
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Venue Address</label>
                      <input
                        type="text"
                        value={e.venueAddress}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.venueAddress = ev.target.value;
                          setEventsList(updated);
                        }}
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory"
                      />
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Google Maps / Location Link (URL)</label>
                      <input
                        type="url"
                        value={e.mapUrl || ""}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.mapUrl = ev.target.value;
                          setEventsList(updated);
                        }}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                      />
                      <p className="text-[0.68rem] text-ivory/50 mt-1">
                        Enter full Google Maps URL here (e.g. https://maps.app.goo.gl/...). If left empty, fallback query is used.
                      </p>
                    </div>

                    <div>
                      <label className="block label-caps text-gold-light mb-1">Location Search Query (Fallback)</label>
                      <input
                        type="text"
                        value={e.mapQuery || ""}
                        onChange={(ev) => {
                          const updated = [...eventsList];
                          updated[idx]!.mapQuery = ev.target.value;
                          setEventsList(updated);
                        }}
                        placeholder="e.g. Neo Convention Janwada Hyderabad"
                        className="w-full rounded border border-gold/30 bg-maroon-deep/30 px-3.5 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cover Photo */}
                  <div className="space-y-4">
                    <MediaPickerInput
                      label="Event Cover Image"
                      value={e.image}
                      onChange={(url) => {
                        const updated = [...eventsList];
                        updated[idx]!.image = url;
                        setEventsList(updated);
                      }}
                      helpText="Photograph rendered on celebration card"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <DeleteConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Celebration Event?"
        message="Are you sure you want to delete this celebration chapter? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
