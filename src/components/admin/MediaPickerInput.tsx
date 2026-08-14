import React, { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Upload, Link as LinkIcon, Image as ImageIcon, Video, Trash2, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface MediaPickerInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  accept?: string;
  placeholder?: string;
  helpText?: string;
  isVideo?: boolean;
}

export function MediaPickerInput({
  label,
  value,
  onChange,
  altText,
  onAltChange,
  accept = "image/*,video/*",
  placeholder = "https://images.unsplash.com/... or upload file",
  helpText,
  isVideo = false,
}: MediaPickerInputProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setUploadError(null);
    try {
      const res = await uploadToCloudinary(file, "wedding", (p) => setProgress(p));
      onChange(res.secure_url);
      setUrlInput(res.secure_url);
      toast.success("Upload Complete ✓ Permanent Cloudinary URL generated.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Cloudinary upload failed. Please try again or paste a URL instead.";
      setUploadError(msg);
      toast.error(msg);
      console.error("Cloudinary upload error:", err);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-tried
      e.target.value = "";
    }
  };

  const handleUrlApply = () => {
    onChange(urlInput);
  };

  const isVideoFile = isVideo || value?.endsWith(".mp4") || value?.endsWith(".webm") || value?.includes("video");

  return (
    <div className="space-y-3 rounded-lg border border-gold/20 bg-nearblack/40 p-4">
      <div className="flex items-center justify-between">
        <label className="font-heading text-xs uppercase tracking-wider text-gold-light">
          {label}
        </label>
        {/* Toggle Mode */}
        <div className="flex items-center gap-1 rounded bg-black/40 p-1 border border-gold/15 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              mode === "upload" ? "bg-gold/20 text-gold-light font-medium" : "text-ivory/60 hover:text-ivory"
            }`}
          >
            <Upload className="h-3 w-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              mode === "url" ? "bg-gold/20 text-gold-light font-medium" : "text-ivory/60 hover:text-ivory"
            }`}
          >
            <LinkIcon className="h-3 w-3" /> External URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold/30 hover:border-gold/60 rounded-md p-4 cursor-pointer transition-colors bg-gold/5 hover:bg-gold/10">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-gold">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs font-semibold">Uploading to Cloudinary... ({progress}%)</span>
                <div className="w-32 h-1 rounded-full bg-gold/20 overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Upload className="h-6 w-6 text-gold" />
                <span className="text-xs font-medium text-ivory">Click to choose image or video</span>
                <span className="text-[0.7rem] text-ivory/50">Supports JPG, PNG, WEBP, MP4, WEBM · Uploaded directly to Cloudinary</span>
              </div>
            )}
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {uploadError && (
            <div className="flex items-start gap-2 rounded border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-snug">{uploadError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded border border-gold/25 bg-black/50 px-3 py-2 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="flex items-center gap-1 rounded border border-gold/40 bg-gold/20 px-3 py-2 text-xs text-gold-light hover:bg-gold/30 transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Apply
          </button>
        </div>
      )}

      {/* Alt Text Option if provided */}
      {onAltChange && (
        <div className="pt-1">
          <input
            type="text"
            value={altText || ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Alt text / description for accessibility..."
            className="w-full rounded border border-gold/20 bg-black/40 px-3 py-1.5 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
        </div>
      )}

      {/* Preview Box */}
      {value && (
        <div className="relative mt-2 rounded border border-gold/20 bg-black/60 p-2 flex items-center gap-3">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded border border-gold/30 bg-black flex items-center justify-center">
            {isVideoFile ? (
              <video src={value} className="h-full w-full object-cover" muted autoPlay loop />
            ) : (
              <img src={value} alt={altText || label} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ivory truncate">{value}</p>
            <p className="text-[0.7rem] text-gold/70 mt-0.5">{isVideoFile ? "Video Media" : "Image Media"}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            title="Clear media"
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {helpText && <p className="text-[0.7rem] text-ivory/50 italic">{helpText}</p>}
    </div>
  );
}
