import { useMobileNavOpen } from "@/lib/store";

// Wraps page content so it slides right when the mobile nav drawer opens.
export default function PageShell({ children }) {
  const open = useMobileNavOpen();
  return (
    <div
      className="min-h-screen transition-transform duration-300 ease-out will-change-transform"
      style={{ transform: open ? "translateX(280px)" : "translateX(0)" }}
    >
      {children}
    </div>
  );
}
