import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Wifi } from "lucide-react"

export default function OverviewPage() {
  const scannedItems = [
    { id: 1, name: "Classic White T-Shirt", time: "2 min ago" },
    { id: 2, name: "Denim Jacket", time: "5 min ago" },
    { id: 3, name: "Running Shoes", time: "8 min ago" },
    { id: 4, name: "Cotton Hoodie", time: "12 min ago" },
    { id: 5, name: "Baseball Cap", time: "15 min ago" },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <TopNav />
      <Sidebar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Device Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-white">ShopKit Device Connected</span>
                </div>
                <Wifi className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#919191]">Battery</span>
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-[#919191]" />
                  <span className="text-sm font-medium text-white">Powered by phone</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#919191]">Status</span>
                <span className="text-sm font-medium text-primary">Online</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-semibold text-white">24</p>
                  <p className="text-sm text-[#919191] mt-1">Items scanned</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">8</p>
                  <p className="text-sm text-[#919191] mt-1">Orders created</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">$342.50</p>
                  <p className="text-sm text-[#919191] mt-1">Total sales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Live Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scannedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-[#1F1F1F] last:border-0"
                  >
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className="text-sm text-[#919191]">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
