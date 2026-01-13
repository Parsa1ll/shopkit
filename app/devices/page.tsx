import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Wifi, WifiOff } from "lucide-react"

export default function DevicesPage() {
  const devices = [
    {
      id: 1,
      name: "ShopKit Scanner #1",
      status: "online",
      lastSeen: "Just now",
      battery: "Powered by phone",
    },
    {
      id: 2,
      name: "ShopKit Scanner #2",
      status: "offline",
      lastSeen: "2 hours ago",
      battery: "Disconnected",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <TopNav />
      <Sidebar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Devices</h2>
            <Button className="bg-primary text-black hover:bg-primary/90">Pair New Device</Button>
          </div>

          <div className="grid gap-4">
            {devices.map((device) => (
              <Card key={device.id} className="bg-[#0D0D0D] border-[#1F1F1F]">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#1A1A1A] rounded-lg">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{device.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {device.status === "online" ? (
                            <>
                              <Wifi className="w-4 h-4 text-primary" />
                              <span className="text-sm text-primary font-medium">Online</span>
                            </>
                          ) : (
                            <>
                              <WifiOff className="w-4 h-4 text-[#919191]" />
                              <span className="text-sm text-[#919191]">Offline</span>
                            </>
                          )}
                          <span className="text-sm text-[#919191]">•</span>
                          <span className="text-sm text-[#919191]">Last seen {device.lastSeen}</span>
                        </div>
                        <p className="text-sm text-[#919191] mt-1">{device.battery}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#1F1F1F] text-white hover:bg-[#1A1A1A] bg-transparent"
                      >
                        Rename
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#1F1F1F] text-white hover:bg-[#1A1A1A] bg-transparent"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Pairing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#919191]">
              <div className="flex gap-3">
                <span className="font-semibold text-white">1.</span>
                <p>Connect your ShopKit device to your phone via USB or Bluetooth</p>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-white">2.</span>
                <p>Open the ShopKit mobile app and follow the pairing prompts</p>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-white">3.</span>
                <p>Your device will automatically appear in this dashboard once paired</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
