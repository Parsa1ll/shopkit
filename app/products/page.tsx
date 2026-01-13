import { TopNav } from "@/components/top-nav"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

export default function ProductsPage() {
  const products = [
    { id: 1, tagId: "RFID-001-4A2B", product: "Classic White T-Shirt", price: "$24.99" },
    { id: 2, tagId: "RFID-002-8C5D", product: "Denim Jacket", price: "$89.99" },
    { id: 3, tagId: "RFID-003-2F9E", product: "Running Shoes", price: "$119.99" },
    { id: 4, tagId: "RFID-004-7B3A", product: "Cotton Hoodie", price: "$54.99" },
    { id: 5, tagId: "RFID-005-1D6C", product: "Baseball Cap", price: "$19.99" },
  ]

  const unassignedTags = [
    { id: 6, tagId: "RFID-006-9E4F" },
    { id: 7, tagId: "RFID-007-3A8B" },
    { id: 8, tagId: "RFID-008-5C2D" },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <TopNav />
      <Sidebar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Products</h2>
          </div>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">RFID Tag Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F1F1F]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">RFID Tag ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Shopify Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#919191]">Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#919191]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-[#1F1F1F] last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-[#919191]" />
                            <span className="text-sm font-mono text-white">{product.tagId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-white">{product.product}</td>
                        <td className="py-4 px-4 text-sm text-white">{product.price}</td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm" className="text-white hover:bg-[#1A1A1A]">
                            Reassign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">Unassigned Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {unassignedTags.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#919191]">No unassigned tags</p>
                  <p className="text-sm text-[#919191] mt-2">All RFID tags have been mapped to products</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unassignedTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between py-3 px-4 bg-[#1A1A1A] rounded-lg border border-[#1F1F1F]"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#919191]" />
                        <span className="text-sm font-mono text-white">{tag.tagId}</span>
                      </div>
                      <Button size="sm" className="bg-primary text-black hover:bg-primary/90">
                        Assign to Product
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
