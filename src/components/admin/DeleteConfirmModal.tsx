import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title = "Delete Item?",
  message = "This action cannot be undone. Are you sure you want to permanently delete this item?",
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-[#1a1618] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-rose-400">
          <div className="rounded-full bg-rose-500/10 p-2 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl text-ivory">{title}</h3>
        </div>

        <p className="text-sm text-ivory/70 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gold/25 px-4 py-2 text-xs font-medium text-ivory/80 hover:bg-gold/10 hover:text-ivory transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-colors"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
