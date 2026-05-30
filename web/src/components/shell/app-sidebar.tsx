"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutTemplate,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VietHayLogo } from "./viethay-logo";

const nav = [
  { href: "/generate", label: "Generate", icon: Sparkles, shortcut: "⌘G" },
  { href: "/history", label: "History", icon: History },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/8 bg-white/[0.04] px-3 py-4 backdrop-blur-md">
      <Link href="/generate" className="mb-4 px-2">
        <VietHayLogo size="md" />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-white/12 bg-gradient-to-r from-violet-500/30 to-cyan-500/15 text-[#f5f5f7]"
                  : "border-white/6 bg-white/[0.03] text-[#e9eaf2]/80 hover:bg-white/[0.06]"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4 opacity-80" />
                {item.label}
              </span>
              {item.shortcut && (
                <span className="text-xs text-[#e9eaf2]/50">{item.shortcut}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 text-xs font-semibold">
            QC
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Quoc Cuong</div>
            <div className="text-xs text-[#e9eaf2]/55">Hackathon mode</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
