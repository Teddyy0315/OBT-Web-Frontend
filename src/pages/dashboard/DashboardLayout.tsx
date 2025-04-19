import { useState } from "react";
import Cookies from "js-cookie";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  BookOpenCheck,
  FlaskConical,
  Users2,
  ActivitySquare,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Recipes", path: "page1", icon: BookOpenCheck },
  { name: "Ingredients", path: "page2", icon: FlaskConical },
  { name: "Users", path: "page3", icon: Users2 },
  { name: "Activity", path: "page4", icon: ActivitySquare },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("permissions");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between w-full">
      <nav className="space-y-2">
        {navItems.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(`/dashboard/${path}`);
          return (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              className={cn(
                "flex items-center w-full gap-2 px-3 py-2 rounded-md transition font-medium text-left cursor-pointer",
                isActive
                  ? "bg-[#00B3FF35] text-[#1E1E1E]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {name}
            </button>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Top bar */}
      <header className="h-20 bg-[#003344] text-white flex items-center px-4 md:px-6 shadow-md">
        <button
          className="md:hidden mr-4"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <h1 className="text-2xl font-semibold">OBT Manager</h1>
      </header>

      {/* Main content area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-56 bg-muted border-r p-4">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-40 z-40"
              onClick={toggleSidebar}
            />
            <aside className="fixed inset-y-0 left-0 w-56 bg-muted p-4 z-50">
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
