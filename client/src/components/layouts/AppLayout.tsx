import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import BottomNavigation from "../BottomNavigation";
import { useTheme } from "@/hooks/use-theme";

type AppLayoutProps = {
  children: ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
  title?: string;
};

export default function AppLayout({
  children,
  showBottomNav = true,
  showHeader = true,
  title = "PlantPal",
}: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNotificationsClick = () => {
    setLocation("/notifications");
  };

  return (
    <div className="relative max-w-md mx-auto h-screen flex flex-col bg-neutral-50 overflow-hidden">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <span className="material-icons text-primary mr-2">eco</span>
              <h1 className="font-heading font-bold text-xl text-neutral-900">{title}</h1>
            </div>
            <div className="flex space-x-3">
              <button
                className="p-1 rounded-full hover:bg-neutral-100"
                onClick={handleNotificationsClick}
              >
                <span className="material-icons text-neutral-700 relative">
                  notifications
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </span>
              </button>
              <button
                className="p-1 rounded-full hover:bg-neutral-100"
                onClick={toggleTheme}
              >
                <span className="material-icons text-neutral-700">
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
