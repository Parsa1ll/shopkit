"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Check, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  tagId: string
  product: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

interface NewSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaleComplete: () => void
}

const PRODUCTS: Product[] = [
  { id: 1, tagId: "RFID-001-4A2B", product: "Classic White T-Shirt", price: 24.99 },
  { id: 2, tagId: "RFID-002-8C5D", product: "Denim Jacket", price: 89.99 },
  { id: 3, tagId: "RFID-003-2F9E", product: "Running Shoes", price: 119.99 },
  { id: 4, tagId: "RFID-004-7B3A", product: "Cotton Hoodie", price: 54.99 },
  { id: 5, tagId: "RFID-005-1D6C", product: "Baseball Cap", price: 19.99 },
]

type DialogState = "item-selection" | "checkout" | "waiting-payment" | "complete"

export function NewSaleDialog({ open, onOpenChange, onSaleComplete }: NewSaleDialogProps) {
  const [state, setState] = useState<DialogState>("item-selection")
  const [cart, setCart] = useState<CartItem[]>([])
  const [rfidBuffer, setRfidBuffer] = useState("")
  const [checkoutTime, setCheckoutTime] = useState<number>(0)
  const [detectedRfid, setDetectedRfid] = useState<string>("")
  const { toast } = useToast()

  const toggleItem = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) {
        return prev.filter((p) => p.id !== product.id)
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== productId))
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      )
    }
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTax = () => {
    return getTotal() * 0.13
  }

  const getTotalWithTax = () => {
    return getTotal() + getTax()
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to continue",
        variant: "destructive",
      })
      return
    }
    
    try {
      const response = await fetch("/api/rfid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfidUid: "PENDING",
          scannerId: "SK-2847",
          items: cart.map((item) => `${item.product} (x${item.quantity})`),
          total: getTotalWithTax(),
        }),
      })
      
      if (!response.ok) throw new Error("Failed to create transaction")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      })
      return
    }
    
    setState("waiting-payment")
    setCheckoutTime(Date.now())
    setRfidBuffer("")
    setDetectedRfid("")
  }

  const completeTransaction = async (rfidUid?: string) => {
    try {
      const uid = rfidUid || "MANUAL-" + Math.random().toString(36).substr(2, 9).toUpperCase()

      const response = await fetch("/api/rfid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfidUid: uid,
          scannerId: "SK-2847",
          items: cart.map((item) => `${item.product} (x${item.quantity})`),
          total: getTotalWithTax(),
        }),
      })

      if (response.ok) {
        setState("complete")
        setTimeout(() => {
          onSaleComplete()
          setCart([])
          setState("item-selection")
          onOpenChange(false)
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: "Failed to process transaction",
          variant: "destructive",
        })
        setState("waiting-payment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      })
      setState("waiting-payment")
    }
  }

  // Listen for RFID scanner input (via API polling)
  useEffect(() => {
    if (state !== "waiting-payment") return

    let buffer = ""
    let pollingInterval: NodeJS.Timeout | null = null

    // Poll the API to detect RFID scans from serial bridge
    const pollForRfid = async () => {
      try {
        const response = await fetch("/api/rfid")
        const transactions = await response.json()
        
        if (transactions.length > 0) {
          const latestTxn = transactions[0]
          
          // Check if this is a recent transaction with RFID
          const txnTime = new Date(latestTxn.timestamp).getTime()
          const isRecent = txnTime > checkoutTime
          const hasRfid = latestTxn.rfidUid && latestTxn.rfidUid !== "PENDING"
          
          if (isRecent && hasRfid && !detectedRfid) {
            console.log("✅ RFID scan detected!", latestTxn.rfidUid)
            setDetectedRfid(latestTxn.rfidUid)
            
            // Show success
            setState("complete")
            setTimeout(() => {
              onSaleComplete()
              setCart([])
              setState("item-selection")
              setCheckoutTime(0)
              setDetectedRfid("")
              onOpenChange(false)
            }, 2000)
          }
        }
      } catch (error) {
        console.error("Error polling for RFID:", error)
      }
    }

    // Keyboard fallback
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          console.log("⌨️ Keyboard RFID:", buffer)
          setDetectedRfid(buffer)
          setState("complete")
          setTimeout(() => {
            onSaleComplete()
            setCart([])
            setState("item-selection")
            setCheckoutTime(0)
            setDetectedRfid("")
            onOpenChange(false)
          }, 2000)
          buffer = ""
        }
      } else if (e.key.length === 1) {
        buffer += e.key
      }
    }

    // Start polling every 300ms
    pollingInterval = setInterval(pollForRfid, 300)
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [state, checkoutTime, detectedRfid, onSaleComplete, onOpenChange])

  const handleClose = () => {
    if (state === "waiting-payment") return
    setCart([])
    setState("item-selection")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-[#0D0D0D] border-[#1F1F1F]">
        {state === "item-selection" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">Select Items to Sell</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {PRODUCTS.map((product) => {
                const cartItem = cart.find((p) => p.id === product.id)
                return (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      cartItem
                        ? "border-primary bg-primary/10"
                        : "border-[#1F1F1F] bg-[#1A1A1A] hover:border-[#2F2F2F]"
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(product)}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-sm font-medium text-white">{product.product}</p>
                          <p className="text-xs text-[#919191] mt-1 font-mono">{product.tagId}</p>
                        </div>
                        <p className="text-sm font-semibold text-white">${product.price.toFixed(2)}</p>
                      </div>
                    </button>

                    {cartItem && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/20">
                        <button
                          onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                          className="p-1 hover:bg-primary/20 rounded"
                        >
                          <Minus className="w-4 h-4 text-primary" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={cartItem.quantity}
                          onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center bg-[#0D0D0D] text-white rounded border border-primary/30 text-sm"
                        />
                        <button
                          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                          className="p-1 hover:bg-primary/20 rounded"
                        >
                          <Plus className="w-4 h-4 text-primary" />
                        </button>
                        <span className="ml-auto text-sm font-medium text-primary">
                          ${(product.price * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#1F1F1F] pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#919191]">Subtotal:</span>
                <span className="text-white">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#919191]">Tax (13%):</span>
                <span className="text-white">${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#1F1F1F] pt-3">
                <span className="text-sm text-[#919191]">Total:</span>
                <span className="text-xl font-bold text-white">${getTotalWithTax().toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-primary text-black hover:bg-primary/90 mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
          </>
        )}

        {state === "waiting-payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">Waiting for Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <p className="text-sm text-[#919191] mb-2">Scan RFID card to complete payment</p>
                <p className="text-3xl font-bold text-white">${getTotalWithTax().toFixed(2)}</p>
                <p className="text-xs text-[#919191] mt-1">Includes 13% tax</p>
                {rfidBuffer && (
                  <p className="text-xs text-primary mt-2 font-mono">Detected: {rfidBuffer}</p>
                )}
              </div>

              <div className="bg-[#1A1A1A] rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-[#919191] mb-2">Items:</p>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-white">
                          {item.product} <span className="text-[#919191]">x{item.quantity}</span>
                        </span>
                        <span className="text-[#919191]">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#1F1F1F] pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#919191]">Subtotal:</span>
                    <span className="text-white">${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#919191]">Tax (13%):</span>
                    <span className="text-white">${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-primary">${getTotalWithTax().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setState("item-selection")
                  setCart([])
                }}
                variant="ghost"
                className="w-full text-[#919191] hover:text-white hover:bg-[#1A1A1A]"
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {state === "complete" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">Payment Complete</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white mb-2">Sale Completed!</p>
                <p className="text-sm text-[#919191]">${getTotalWithTax().toFixed(2)} received</p>
                <p className="text-xs text-[#919191] mt-1">(Includes 13% tax)</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
