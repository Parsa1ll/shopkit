"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewSaleDialog } from "@/components/new-sale-dialog"

export default function NewSaleBox() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSaleComplete = () => {
    // Refresh data or update UI as needed
    window.location.reload()
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">New Sale</h3>
              <p className="text-sm text-[#919191]">Select items and complete a sale</p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-black hover:bg-primary/90 h-12 w-12 rounded-full p-0 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <NewSaleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaleComplete={handleSaleComplete}
      />
    </>
  )
}
