"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const [offlineMode, setOfflineMode] = useState(false)
  const [autoSync, setAutoSync] = useState(true)

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <TopNav />
      <Sidebar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Settings</h2>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Offline Mode</CardTitle>
              <CardDescription className="text-[#919191]">
                Continue scanning and processing sales without an internet connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="offline-mode" className="cursor-pointer text-white">
                  Enable offline mode
                </Label>
                <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} />
              </div>
              {offlineMode && (
                <p className="text-sm text-[#919191]">
                  Sales will be synced to Shopify automatically when connection is restored
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Sync Preferences</CardTitle>
              <CardDescription className="text-[#919191]">
                Control how ShopKit syncs with your Shopify store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync" className="cursor-pointer text-white">
                  Auto-sync product catalog
                </Label>
                <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
              <Button
                variant="outline"
                className="w-full border-[#1F1F1F] text-white hover:bg-[#1A1A1A] bg-transparent"
              >
                Sync Now
              </Button>
              <p className="text-sm text-[#919191]">Last synced: 5 minutes ago</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Store Connection</CardTitle>
              <CardDescription className="text-[#919191]">Manage your Shopify store connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-[#1A1A1A] rounded-lg border border-[#1F1F1F]">
                <div>
                  <p className="text-sm font-medium text-white">Connected Store</p>
                  <p className="text-sm text-[#919191] mt-1">main-store.myshopify.com</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-primary">Connected</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-[#1F1F1F] text-white hover:bg-[#1A1A1A] bg-transparent"
              >
                Change Store
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
