import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// In-memory store for transactions (persisted to file)
const transactionsFile = path.join(process.cwd(), 'transactions.json')

interface Transaction {
  id: string
  items: string[]
  total: number
  scannerId: string
  timestamp: Date
  rfidUid: string
}

// RFID to product mapping
const rfidToProduct: { [key: string]: { product: string; price: number } } = {
  'AB:CD:EF:12:34': { product: 'Classic White T-Shirt', price: 24.99 },
  'CD:EF:12:34:56': { product: 'Denim Jacket', price: 89.99 },
  'EF:12:34:56:78': { product: 'Running Shoes', price: 119.99 },
  '12:34:56:78:9A': { product: 'Cotton Hoodie', price: 54.99 },
  '34:56:78:9A:BC': { product: 'Baseball Cap', price: 19.99 },
}

// Default scanner ID
const defaultScannerId = 'SK-2847'

function generateTransactionId(): string {
  const num = Math.floor(Math.random() * 900) + 100
  return `TXN-${num}`
}

function readTransactions(): Transaction[] {
  try {
    if (fs.existsSync(transactionsFile)) {
      const data = fs.readFileSync(transactionsFile, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading transactions:', error)
  }
  return []
}

function writeTransactions(transactions: Transaction[]): void {
  try {
    fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2))
  } catch (error) {
    console.error('Error writing transactions:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rfidUid, scannerId, items, total } = body

    if (!rfidUid) {
      return NextResponse.json({ error: 'rfidUid is required' }, { status: 400 })
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: generateTransactionId(),
      items: items || [],
      total: total || 0,
      scannerId: scannerId || defaultScannerId,
      timestamp: new Date(),
      rfidUid: rfidUid,
    }

    // Read existing transactions, add new one, and save
    const transactions = readTransactions()
    transactions.unshift(newTransaction) // Add to beginning (most recent first)
    writeTransactions(transactions)

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    console.error('Error processing RFID detection:', error)
    return NextResponse.json(
      { error: 'Failed to process RFID detection' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const transactions = readTransactions()
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
