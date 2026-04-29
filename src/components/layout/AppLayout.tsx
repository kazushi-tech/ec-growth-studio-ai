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
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </main>
        <MobileNav open={open} onClose={close} key={location.pathname} />
      </div>
    </MobileNavContext.Provider>
  );
}
