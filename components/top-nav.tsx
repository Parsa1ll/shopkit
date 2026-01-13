"use client"

import { useState } from "react"
import { Check, ChevronDown, LogOut, Settings2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShopifyLogo } from "@/components/shopify-logo"

export function TopNav() {
  const [selectedStore, setSelectedStore] = useState("Main Store")
  const stores = ["Main Store", "Pop-up Store", "Warehouse"]

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/10 backdrop-blur-[120px] border-b border-[#1F1F1F] z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-8">
          <ShopifyLogo className="h-8 w-auto text-white" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm font-medium text-white">
              {selectedStore}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-[#0D0D0D] border-[#1F1F1F]">
              {stores.map((store) => (
                <DropdownMenuItem
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className="flex items-center justify-between text-white focus:bg-[#1F1F1F] focus:text-white"
                >
                  {store}
                  {selectedStore === store && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-gray-400">Connected</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/20" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#0D0D0D] border-[#1F1F1F] text-white">
              <DropdownMenuItem className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer text-[#919191]">
                <Settings2 className="mr-2 h-4 w-4 text-[#919191]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#1F1F1F] focus:text-white cursor-pointer text-[#919191]">
                <LogOut className="mr-2 h-4 w-4 text-[#919191]" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
