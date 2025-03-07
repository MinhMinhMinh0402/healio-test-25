import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  FiHome, 
  FiFileText, 
  FiActivity, 
  FiCalendar, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX 
} from "react-icons/fi";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", icon: FiHome, label: "Dashboard" },
    { href: "/health-records", icon: FiFileText, label: "Health Records" },
    { href: "/ai-diagnosis", icon: FiActivity, label: "AI Assistant" },
    { href: "/appointments", icon: FiCalendar, label: "Appointments" },
    { href: "/profile", icon: FiUser, label: "Profile" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <FiMenu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-600">Healio</h1>
          <p className="text-sm text-muted-foreground">Personal Health Platform</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                location === item.href 
                  ? "bg-green-600 text-white" 
                  : "text-gray-700 hover:bg-green-50"
              )}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* User profile and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <FiUser className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName || user?.username}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiLogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}