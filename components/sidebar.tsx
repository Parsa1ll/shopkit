"use client"

import { Home, ShoppingCart, Package, Smartphone, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Overview", href: "/" },
    { icon: ShoppingCart, label: "Live Sales", href: "/live-sales" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: Smartphone, label: "Devices", href: "/devices" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#0D0D0D] border-r border-[#1F1F1F]">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-[#1A1A1A] text-white" : "text-[#919191] hover:bg-[#1A1A1A]/50 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
