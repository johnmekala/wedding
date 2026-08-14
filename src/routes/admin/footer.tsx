import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useWeddingData,
  updateWeddingPath,
  type FooterData,
  type SocialLinkItem,
  type DepartmentItem,
  type DepartmentDetailsSectionData,
  defaultDepartmentDetails,
} from "@/lib/useWeddingData";
import { MediaPickerInput } from "@/components/admin/MediaPickerInput";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import {
  Footprints,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2,
  Phone,
  MessageCircle,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/footer")({
  component: AdminFooterCMS,
});

function AdminFooterCMS() {
  const data = useWeddingData();
  const [footer, setFooter] = useState<FooterData>(data.footer);
  const [socials, setSocials] = useState<SocialLinkItem[]>(data.socialLinks || []);
  const [deptSection, setDeptSection] = useState<DepartmentDetailsSectionData>(
    data.departmentDetails || defaultDepartmentDetails
  );
  const [deleteSocialIndex, setDeleteSocialIndex] = useState<number | null>(null);
  const [deleteDeptIndex, setDeleteDeptIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.loading) {
      setFooter(data.footer);
      setSocials(data.socialLinks || []);
      setDeptSection(data.departmentDetails || defaultDepartmentDetails);
    }
  }, [data.loading, data.footer, data.socialLinks, data.departmentDetails]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWeddingPath("footer", footer);
      await updateWeddingPath("socialLinks", socials);
      await updateWeddingPath("departmentDetails", deptSection);
      await updateWeddingPath("departments", deptSection.departments || []);
      toast.success("Footer & Department Details settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save footer settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = () => {
    const newSocial: SocialLinkItem = {
      id: Date.now().toString(),
      platform: "Instagram",
      url: "https://instagram.com",
      icon: "Instagram",
      active: true,
      order: socials.length + 1,
    };
    setSocials([newSocial, ...socials]);
  };

  const handleMoveSocial = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= socials.length) return;
    const updated = [...socials];
    const moved = updated.splice(index, 1)[0];
    if (moved) {
      updated.splice(target, 0, moved);
      setSocials(updated);
    }
  };

  const confirmDeleteSocial = () => {
    if (deleteSocialIndex !== null) {
      const updated = [...socials];
      updated.splice(deleteSocialIndex, 1);
      setSocials(updated);
      setDeleteSocialIndex(null);
      toast.info("Social link deleted. Remember to save changes.");
    }
  };

  const handleAddDepartment = () => {
    const newDept: DepartmentItem = {
      id: "dept-" + Date.now().toString(),
      name: "New Department",
      headName: "Team Lead",
      phone: "9876543210",
      teamMembersCount: 5,
      whatsapp: "9876543210",
      active: true,
      order: (deptSection.departments?.length || 0) + 1,
    };
    const updated = [newDept, ...(deptSection.departments || [])];
    setDeptSection({ ...deptSection, departments: updated });
    toast.info("New department added. Remember to click Save.");
  };

  const handleMoveDepartment = (index: number, direction: "up" | "down") => {
    const list = [...(deptSection.departments || [])];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const moved = list.splice(index, 1)[0];
    if (moved) {
      list.splice(target, 0, moved);
      const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
      setDeptSection({ ...deptSection, departments: reordered });
    }
  };

  const updateDeptField = (index: number, field: keyof DepartmentItem, value: any) => {
    const list = [...(deptSection.departments || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setDeptSection({ ...deptSection, departments: list });
    }
  };

  const confirmDeleteDepartment = () => {
    if (deleteDeptIndex !== null) {
      const list = [...(deptSection.departments || [])];
      list.splice(deleteDeptIndex, 1);
      const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
      setDeptSection({ ...deptSection, departments: reordered });
      setDeleteDeptIndex(null);
      toast.info("Department deleted. Remember to click Save.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div>
          <h1 className="font-display text-2xl text-gold-light flex items-center gap-2">
            <Footprints className="h-6 w-6 text-gold" /> Footer &amp; Department Details CMS
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Manage Department Details, footer branding, contact details, and social media handles
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gold px-4 py-2 text-xs font-semibold text-nearblack hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)] disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="rounded-lg border border-gold/30 bg-nearblack/70 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gold/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-gold/15 border border-gold/30 text-gold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl text-gold-light">Department Details Section</h2>
              <p className="text-xs text-ivory/60">
                Row/table-style directory in the Footer with direct Call &amp; WhatsApp actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-ivory/80 cursor-pointer bg-black/40 px-3 py-1.5 rounded border border-gold/20">
              <input
                type="checkbox"
                checked={deptSection.enabled !== false}
                onChange={(e) => setDeptSection({ ...deptSection, enabled: e.target.checked })}
                className="rounded text-gold focus:ring-gold"
              />
              Section Enabled
            </label>

            <button
              onClick={handleAddDepartment}
              className="flex items-center gap-1.5 rounded bg-gold/20 border border-gold/40 px-3.5 py-1.5 text-xs font-medium text-gold-light hover:bg-gold hover:text-nearblack transition-all"
            >
              <Plus className="h-4 w-4" /> Add Department
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Section Badge / Label</label>
            <input
              type="text"
              value={deptSection.sectionLabel || ""}
              onChange={(e) => setDeptSection({ ...deptSection, sectionLabel: e.target.value })}
              placeholder="Event Operations & Coordination"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Section Main Title</label>
            <input
              type="text"
              value={deptSection.sectionTitle || ""}
              onChange={(e) => setDeptSection({ ...deptSection, sectionTitle: e.target.value })}
              placeholder="Department Details"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-caps text-xs text-gold/80 mb-1 block">Subtitle / Description</label>
            <input
              type="text"
              value={deptSection.subtitle || ""}
              onChange={(e) => setDeptSection({ ...deptSection, subtitle: e.target.value })}
              placeholder="Key contacts and operational leads dedicated to orchestrating our celebration"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="label-caps text-xs text-gold/90">
              Configured Departments ({(deptSection.departments || []).length})
            </h3>
            <span className="text-[0.68rem] text-ivory/40">
              Order here matches public row display order
            </span>
          </div>

          {(deptSection.departments || []).length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gold/20 rounded-lg bg-black/20 text-ivory/50 text-xs">
              No departments added yet. Click &quot;Add Department&quot; above to create one.
            </div>
          ) : (
            (deptSection.departments || []).map((dept, idx) => (
              <div
                key={dept.id || idx}
                className={`rounded-lg border p-4 space-y-3 transition-all ${
                  dept.active !== false
                    ? "border-gold/25 bg-black/50"
                    : "border-gray-800 bg-black/20 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveDepartment(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDepartment(idx, "down")}
                        disabled={idx === (deptSection.departments?.length || 0) - 1}
                        className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-mono text-xs text-gold/70">#{idx + 1}</span>
                    <span className="font-heading text-xs uppercase tracking-wider text-gold-light font-medium">
                      {dept.name || "Untitled Department"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateDeptField(idx, "active", !dept.active)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[0.65rem] label-caps transition-colors ${
                        dept.active !== false
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {dept.active !== false ? (
                        <>
                          <Eye className="h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Hidden
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteDeptIndex(idx)}
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <label className="text-[0.68rem] label-caps text-gold/70 block mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) => updateDeptField(idx, "name", e.target.value)}
                      placeholder="e.g. Camera / Sound"
                      className="w-full rounded border border-gold/20 bg-black/60 px-2.5 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[0.68rem] label-caps text-gold/70 block mb-1">
                      Head Name
                    </label>
                    <input
                      type="text"
                      value={dept.headName}
                      onChange={(e) => updateDeptField(idx, "headName", e.target.value)}
                      placeholder="e.g. John"
                      className="w-full rounded border border-gold/20 bg-black/60 px-2.5 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[0.68rem] label-caps text-gold/70 block mb-1 flex items-center gap-1">
                      <Phone className="h-2.5 w-2.5 text-gold" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={dept.phone}
                      onChange={(e) => updateDeptField(idx, "phone", e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded border border-gold/20 bg-black/60 px-2.5 py-1.5 text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[0.68rem] label-caps text-gold/70 block mb-1 flex items-center gap-1">
                      <Users className="h-2.5 w-2.5 text-gold" /> Team Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={dept.teamMembersCount}
                      onChange={(e) => updateDeptField(idx, "teamMembersCount", e.target.value)}
                      placeholder="e.g. 8"
                      className="w-full rounded border border-gold/20 bg-black/60 px-2.5 py-1.5 text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[0.68rem] label-caps text-gold/70 block mb-1 flex items-center gap-1">
                      <MessageCircle className="h-2.5 w-2.5 text-emerald-400" /> WhatsApp
                    </label>
                    <input
                      type="text"
                      value={dept.whatsapp}
                      onChange={(e) => updateDeptField(idx, "whatsapp", e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded border border-gold/20 bg-black/60 px-2.5 py-1.5 text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-6">
        <h2 className="font-display text-lg text-gold-light">Footer Wording &amp; Branding</h2>

        <MediaPickerInput
          label="Footer Logo Idol"
          value={footer.logo || ""}
          onChange={(url) => setFooter({ ...footer, logo: url })}
          helpText="Central image idol displayed above the invocation in footer"
        />

        <div>
          <label className="label-caps text-xs text-gold/80 mb-1 block">Footer Wording / Summary</label>
          <textarea
            rows={2}
            value={footer.description || ""}
            onChange={(e) => setFooter({ ...footer, description: e.target.value })}
            className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Copyright Line</label>
            <input
              type="text"
              value={footer.copyrightText || ""}
              onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Credits / Made By Line</label>
            <input
              type="text"
              value={footer.creditText || ""}
              onChange={(e) => setFooter({ ...footer, creditText: e.target.value })}
              placeholder="Made with love for Sriya & Janak"
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="label-caps text-xs text-gold/80 mb-1 block">Revisit Button Label</label>
          <input
            type="text"
            value={footer.revisitButtonText || ""}
            onChange={(e) => setFooter({ ...footer, revisitButtonText: e.target.value })}
            placeholder="Revisit Our Celebration"
            className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <h2 className="font-display text-lg text-gold-light">General Contact Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Phone Number</label>
            <input
              type="text"
              value={footer.phone || ""}
              onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Email Address</label>
            <input
              type="email"
              value={footer.email || ""}
              onChange={(e) => setFooter({ ...footer, email: e.target.value })}
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">City / Address</label>
            <input
              type="text"
              value={footer.address || ""}
              onChange={(e) => setFooter({ ...footer, address: e.target.value })}
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="label-caps text-xs text-gold/80 mb-1 block">Google Maps Link</label>
            <input
              type="text"
              value={footer.mapUrl || ""}
              onChange={(e) => setFooter({ ...footer, mapUrl: e.target.value })}
              className="w-full rounded border border-gold/25 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-nearblack/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gold/15 pb-3">
          <h2 className="font-display text-lg text-gold-light">Social Media Handles</h2>
          <button
            onClick={handleAddSocial}
            className="flex items-center gap-1 text-xs text-gold hover:text-gold-light border border-gold/30 px-3 py-1.5 rounded hover:bg-gold/10 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Social Handle
          </button>
        </div>

        <div className="space-y-3">
          {socials.map((soc, idx) => (
            <div
              key={soc.id || idx}
              className="flex flex-col sm:flex-row items-center gap-3 rounded border border-gold/15 bg-black/40 p-3"
            >
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMoveSocial(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMoveSocial(idx, "down")}
                  disabled={idx === socials.length - 1}
                  className="p-1 text-ivory/50 hover:text-gold disabled:opacity-20"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="grid flex-1 gap-3 sm:grid-cols-2 w-full">
                <input
                  type="text"
                  value={soc.platform}
                  onChange={(e) => {
                    const updated = [...socials];
                    if (updated[idx]) {
                      updated[idx] = { ...updated[idx], platform: e.target.value };
                      setSocials(updated);
                    }
                  }}
                  placeholder="Platform (e.g. Instagram)"
                  className="rounded border border-gold/20 bg-black/60 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
                <input
                  type="url"
                  value={soc.url}
                  onChange={(e) => {
                    const updated = [...socials];
                    if (updated[idx]) {
                      updated[idx] = { ...updated[idx], url: e.target.value };
                      setSocials(updated);
                    }
                  }}
                  placeholder="Target URL"
                  className="rounded border border-gold/20 bg-black/60 px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0">
                <label className="flex items-center gap-1.5 text-xs text-ivory/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soc.active ?? true}
                    onChange={(e) => {
                      const updated = [...socials];
                      if (updated[idx]) {
                        updated[idx] = { ...updated[idx], active: e.target.checked };
                        setSocials(updated);
                      }
                    }}
                    className="rounded text-gold focus:ring-gold"
                  />
                  Active
                </label>
                <button
                  onClick={() => setDeleteSocialIndex(idx)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteSocialIndex !== null}
        title="Delete Social Media Link?"
        message="Are you sure you want to remove this social handle from the footer?"
        onConfirm={confirmDeleteSocial}
        onCancel={() => setDeleteSocialIndex(null)}
      />

      <DeleteConfirmModal
        isOpen={deleteDeptIndex !== null}
        title="Delete Department?"
        message="Are you sure you want to remove this department from the directory?"
        onConfirm={confirmDeleteDepartment}
        onCancel={() => setDeleteDeptIndex(null)}
      />
    </div>
  );
}
