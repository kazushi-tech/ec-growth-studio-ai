import { useEffect } from "react";
import { X } from "lucide-react";
import { SidebarBody } from "./Sidebar";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-y-0 left-0 flex w-64 max-w-[85vw] flex-col bg-navy-950 text-navy-100 shadow-cardLg">
        <button
          type="button"
          onClick={onClose}
          aria-label="メニューを閉じる"
          className="absolute right-2 top-2 rounded-md p-1.5 text-navy-200 hover:bg-navy-800/60 hover:text-white"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <SidebarBody onNavigate={onClose} />
      </div>
    </div>
  );
}
