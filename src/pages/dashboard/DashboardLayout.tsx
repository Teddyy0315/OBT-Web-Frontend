import Cookies from "js-cookie";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  BookOpenCheck,
  FlaskConical,
  Users2,
  ActivitySquare,
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

  const handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("permissions");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="h-14 bg-primary text-white flex items-center px-6 shadow-md">
        <h1 className="text-lg font-semibold">OBT Manager</h1>
        <div className="ml-auto text-sm opacity-80">
          Logged in as {localStorage.getItem("username")}
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-muted border-r p-4 flex flex-col justify-between">
          <nav className="space-y-2">
            {navItems.map(({ name, path, icon: Icon }) => {
              const isActive = location.pathname.startsWith(
                `/dashboard/${path}`
              );
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition font-medium",
                    isActive
                      ? "bg-primary text-white shadow"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
