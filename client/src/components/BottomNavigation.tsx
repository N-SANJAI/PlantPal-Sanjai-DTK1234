import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>(location);

  useEffect(() => {
    setActiveTab(location);
  }, [location]);

  const navigate = (path: string) => {
    setLocation(path);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white shadow-lg z-10">
      <div className="flex items-center justify-around px-2 py-2">
        <button
          className={`bottom-nav-item flex flex-col items-center py-1 px-3 ${
            activeTab === "/" ? "active text-primary -translate-y-1" : "text-neutral-600"
          }`}
          onClick={() => navigate("/")}
        >
          <span className="material-icons">home</span>
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          className={`bottom-nav-item flex flex-col items-center py-1 px-3 ${
            activeTab === "/social" ? "active text-primary -translate-y-1" : "text-neutral-600"
          }`}
          onClick={() => navigate("/social")}
        >
          <span className="material-icons">people</span>
          <span className="text-xs mt-1">Social</span>
        </button>

        <div className="flex flex-col items-center relative">
          <button
            className="bg-primary text-white rounded-full p-3 shadow-md -mt-5"
            onClick={() => navigate("/scan")}
          >
            <span className="material-icons">add_a_photo</span>
          </button>
          <span className="text-xs mt-1 text-neutral-600">Quick Scan</span>
        </div>

        <button
          className={`bottom-nav-item flex flex-col items-center py-1 px-3 ${
            activeTab === "/achievements" ? "active text-primary -translate-y-1" : "text-neutral-600"
          }`}
          onClick={() => navigate("/achievements")}
        >
          <span className="material-icons">emoji_events</span>
          <span className="text-xs mt-1">Progress</span>
        </button>

        <button
          className={`bottom-nav-item flex flex-col items-center py-1 px-3 ${
            activeTab === "/profile" ? "active text-primary -translate-y-1" : "text-neutral-600"
          }`}
          onClick={() => navigate("/profile")}
        >
          <span className="material-icons">person</span>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
}
