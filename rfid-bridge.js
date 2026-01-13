#!/usr/bin/env node

/**
 * RFID Serial to API Bridge
 * Reads RFID data from Arduino serial port and sends to ShopKit API
 */

const SerialPort = require('serialport').SerialPort;
const { ReadlineParser } = require('@serialport/parser-readline');

// Configuration
const SERIAL_PORT = process.env.SERIAL_PORT || '/dev/cu.usbmodem21301'; // Change if needed (e.g., /dev/ttyACM0, COM3)
const BAUD_RATE = 9600;
const API_URL = process.env.API_URL || 'http://localhost:3000/api/rfid';
const SCANNER_ID = process.env.SCANNER_ID || 'SK-2847';

console.log('🚀 RFID Serial Bridge Starting...');
console.log(`Serial Port: ${SERIAL_PORT}`);
console.log(`Baud Rate: ${BAUD_RATE}`);
console.log(`API URL: ${API_URL}`);
console.log('');

// Create serial port instance
const port = new SerialPort({
  path: SERIAL_PORT,
  baudRate: BAUD_RATE,
});

// Parse serial data line by line
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (line) => {
  const trimmed = line.trim();
  console.log(`📨 Raw: ${trimmed}`);

  // Look for lines containing "TAG DETECTED UID=" or "UID:"
  if (trimmed.includes('UID')) {
    let match = trimmed.match(/UID=(.+?)(?:\s|$)/);
    if (!match) {
      match = trimmed.match(/UID:\s*(.+?)$/);
    }
    if (match) {
      const rfidUid = match[1].trim();
      console.log(`✅ Detected RFID: ${rfidUid}`);
      
      // Send to API
      sendToAPI(rfidUid);
    }
  }
});

async function sendToAPI(rfidUid) {
  try {
    const payload = {
      rfidUid: rfidUid,
      scannerId: SCANNER_ID,
    };

    console.log(`📤 Sending to API: ${JSON.stringify(payload)}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API Response: ${JSON.stringify(data)}`);
    } else {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`❌ Error sending to API:`, error.message);
  }
}

port.on('open', () => {
  console.log('✅ Serial port opened');
  console.log('Listening for RFID scans...');
  console.log('');
});

port.on('error', (err) => {
  console.error('❌ Serial Port Error:', err.message);
  console.error('');
  console.error('Common fixes:');
  console.error('1. Check Arduino is connected: ls /dev/tty*');
  console.error('2. Install ch340 driver (if using CH340 USB chip)');
  console.error('3. Set correct port: SERIAL_PORT=/dev/ttyUSB0 npm start');
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  port.close(() => {
    console.log('✅ Serial port closed');
    process.exit(0);
  });
});
