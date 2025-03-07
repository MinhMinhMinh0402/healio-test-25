import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
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

// Get base path from the environment
const basePath = "/healio-test-25";
const useBasePath = (path: string) => `${basePath}${path}`;

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function SidebarNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: useBasePath("/"),
      icon: FiHome,
    },
    {
      title: "Health Records",
      href: useBasePath("/health-records"),
      icon: FiFileText,
    },
    {
      title: "AI Assistant",
      href: useBasePath("/ai-diagnosis"),
      icon: FiActivity,
    },
    {
      title: "Appointments",
      href: useBasePath("/appointments"),
      icon: FiCalendar,
    },
    {
      title: "Profile",
      href: useBasePath("/profile"),
      icon: FiUser,
    },
  ];

  return (
    <>
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

      <div className={cn(
        "sidebar",
        isMobileMenuOpen ? "sidebar-mobile-visible" : "sidebar-mobile-hidden"
      )}>
        <div className="p-6 border-b">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Healio</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Personal Health Platform</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {user?.fullName?.[0] || user?.username?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.fullName || user?.username}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => logoutMutation.mutate()}
          >
            <FiLogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}