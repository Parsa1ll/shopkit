"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RFIDTestPage() {
  const [buffer, setBuffer] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    let currentBuffer = ""
    let lastKeyTime = Date.now()

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now()
      const timeSinceLastKey = now - lastKeyTime
      lastKeyTime = now

      // Log every key press with timing
      const logEntry = `Key: "${e.key}" (code: ${e.keyCode}) - ${timeSinceLastKey}ms since last`
      setLogs((prev) => [...prev.slice(-20), logEntry])

      // Check if typing in input
      const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      
      if (e.key === "Enter") {
        if (currentBuffer.length > 0) {
          setLogs((prev) => [...prev, `✅ COMPLETE SCAN: "${currentBuffer}"`])
          setBuffer(currentBuffer)
          currentBuffer = ""
        }
      } else if (e.key.length === 1) {
        currentBuffer += e.key
        setBuffer(currentBuffer)
      }

      // Log target info
      setLogs((prev) => [...prev, `Target: ${inInput ? 'INPUT' : 'WINDOW'}`])
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">RFID Scanner Test</h1>
        
        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-[#919191] space-y-2">
            <p>1. Make sure this browser window is focused</p>
            <p>2. Scan your RFID card</p>
            <p>3. Watch the logs below to see what data is captured</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Current Buffer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1A1A1A] p-4 rounded font-mono text-primary text-lg min-h-[60px]">
              {buffer || <span className="text-[#919191]">Waiting for input...</span>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Keyboard Event Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1A1A1A] p-4 rounded font-mono text-xs space-y-1 max-h-[400px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-[#919191]">No events yet...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={log.includes("✅") ? "text-primary font-bold" : "text-white"}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-[#1F1F1F]">
          <CardHeader>
            <CardTitle className="text-white">Manual Test Input</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#919191] mb-4">
              Type or paste RFID data here to test if it would work:
            </p>
            <input
              type="text"
              placeholder="Type or scan here..."
              className="w-full bg-[#1A1A1A] text-white border border-[#1F1F1F] rounded p-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.currentTarget.value
                  setLogs((prev) => [...prev, `📝 Manual input: "${value}"`])
                  setBuffer(value)
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
