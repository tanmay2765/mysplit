import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Scale,
  HandCoins,
  Upload,
  FileBarChart,
  Search,
  Bell,
  Plus,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/balances", label: "Balances", icon: Scale },
  { to: "/settlements", label: "Settlements", icon: HandCoins },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/import-csv", label: "Import CSV", icon: Upload },
  { to: "/import-reports", label: "Import Reports", icon: FileBarChart },
] as const;

function SidebarContent({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-2 p-5">
      <div className="flex items-center gap-2 px-2 pb-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold">
          S
        </div>
        <div>
          <div className="text-base font-bold text-foreground">SplitWell</div>
          <div className="text-xs text-muted-foreground">Shared Expenses</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNav}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_var(--primary)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <div className="card-soft flex items-center gap-3 p-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces"
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">Tanmay Dhiman</div>
            <div className="truncate text-xs text-muted-foreground">tanmay@splitwell.app</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1440px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 lg:block">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-[280px] bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent pathname={pathname} onNav={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/80 px-4 py-4 backdrop-blur md:px-6 lg:px-8">
            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden flex-1 md:block max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search expenses, members, groups..."
                className="h-11 rounded-2xl border-border bg-card pl-11"
              />
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
              <Button size="sm" className="hidden rounded-2xl md:inline-flex">
                <Plus className="mr-1 h-4 w-4" /> Add Expense
              </Button>
              <button
                className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </button>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces"
                alt="User"
                className="h-11 w-11 rounded-2xl object-cover"
              />
            </div>
          </header>
          <main className="px-4 pb-12 md:px-6 lg:px-8">{children ?? <Outlet />}</main>
        </div>
      </div>
    </div>
  );
}