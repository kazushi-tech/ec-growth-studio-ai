import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { MobileNavContext } from "./mobileNavContext";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // ルートが変わったらドロワーは閉じる
  const close = () => setOpen(false);

  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      <a
        href="#main"
        className="sr-only-focusable fixed left-3 top-3 z-50 inline-flex items-center gap-1 rounded-md bg-navy-900 px-3 py-2 text-xs font-semibold text-white shadow-cardLg"
      >
        本文へスキップ
      </a>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main
          id="main"
          tabIndex={-1}
          className="flex min-w-0 flex-1 flex-col focus-visible:outline-none"
        >
          <Outlet />
        </main>
        <MobileNav open={open} onClose={close} key={location.pathname} />
      </div>
    </MobileNavContext.Provider>
  );
}
