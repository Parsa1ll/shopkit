"use client"
import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const salesData = [
  { time: "9:00", sales: 120 },
  { time: "9:30", sales: 185 },
  { time: "10:00", sales: 320 },
  { time: "10:30", sales: 290 },
  { time: "11:00", sales: 450 },
  { time: "11:30", sales: 520 },
  { time: "12:00", sales: 780 },
  { time: "12:30", sales: 850 },
  { time: "13:00", sales: 920 },
  { time: "13:30", sales: 880 },
  { time: "14:00", sales: 1050 },
  { time: "14:30", sales: 1280 },
  { time: "15:00", sales: 1520 },
  { time: "15:30", sales: 1450 },
  { time: "16:00", sales: 1680 },
  { time: "16:30", sales: 1820 },
  { time: "17:00", sales: 1950 },
]

interface Transaction {
  id: string
  items: string[]
  total: number
  scannerId: string
  timestamp: Date
}

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    items: ["Classic White T-Shirt", "Denim Jacket"],
    total: 139.97,
    scannerId: "SK-2847",
    timestamp: new Date(2024, 0, 13, 16, 32),
  },
  {
    id: "TXN-002",
    items: ["Running Shoes"],
    total: 119.99,
    scannerId: "SK-2847",
    timestamp: new Date(2024, 0, 13, 16, 18),
  },
  {
    id: "TXN-003",
    items: ["Leather Wallet", "Canvas Tote Bag"],
    total: 84.98,
    scannerId: "SK-2847",
    timestamp: new Date(2024, 0, 13, 15, 45),
  },
  {
    id: "TXN-004",
    items: ["Hoodie", "Sweatpants"],
    total: 129.98,
    scannerId: "SK-1923",
    timestamp: new Date(2024, 0, 13, 15, 12),
  },
  {
    id: "TXN-005",
    items: ["Sunglasses"],
    total: 149.99,
    scannerId: "SK-2847",
    timestamp: new Date(2024, 0, 13, 14, 38),
  },
]

export default function LiveSalesPage() {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <TopNav />
      <Sidebar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Live Sales</h2>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#86efac" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#1A1A1A] border border-[#333] p-2 rounded-lg shadow-xl">
                            <p className="text-white font-medium text-sm">
                              ${payload[0].value} <span className="text-gray-400 ml-2">{payload[0].payload.time}</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="natural" dataKey="sales" stroke="#86efac" strokeWidth={2} fill="url(#salesGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-start justify-between py-4 border-b border-[#1F1F1F] last:border-0"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-white">{transaction.items.join(", ")}</p>
                      <div className="flex items-center gap-4 text-xs text-[#919191]">
                        <span>Scanner: <span className="font-mono">{transaction.scannerId}</span></span>
                        <span>•</span>
                        <span>
                          {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${transaction.total.toFixed(2)}</p>
                      <p className="text-xs text-[#919191] mt-1 font-mono">{transaction.id}</p>
                    </div>
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
