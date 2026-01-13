// Arduino sketch for RFID detection with WiFi (for Arduino MKR WiFi 1010 or similar)
// This requires a WiFi-capable board. If using a non-WiFi board, connect via Serial
// and use a computer/Raspberry Pi to forward data to the web API.

#include <SPI.h>
#include <MFRC522.h>
#include <WiFiNINA.h>
#include <ArduinoJson.h>

// --- PIN DEFINITIONS ---
#define SS_PIN   6    // SDA / CS
#define RST_PIN  7    // RST

// --- WiFi CREDENTIALS ---
const char ssid[] = "YOUR_WIFI_SSID";           // Your WiFi network name
const char password[] = "YOUR_WIFI_PASSWORD";   // Your WiFi password
const char serverName[] = "YOUR_SERVER_IP";     // Your server IP or domain (e.g., "192.168.1.100:3000" or "shopkit.local")

MFRC522 mfrc522(SS_PIN, RST_PIN);
WiFiClient client;

void setup() {
  Serial.begin(9600);
  while (!Serial) { ; }

  SPI.begin();
  mfrc522.PCD_Init();
  
  Serial.println("RFID ready. Connecting to WiFi...");
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("RFID ready. Tap your card or fob.");
}

void loop() {
  // Check for new card
  if (!mfrc522.PICC_IsNewCardPresent()) return;

  // Read card UID
  if (!mfrc522.PICC_ReadCardSerial()) return;

  // Format UID as colon-separated hex string
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) uid += ":";
  }
  
  Serial.print("Tag detected! UID: ");
  Serial.println(uid);

  // Send RFID data to server
  sendRFIDToServer(uid);

  // Properly halt card
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  delay(300); // debounce
}

void connectToWiFi() {
  int status = WL_IDLE_STATUS;
  
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    
    status = WiFi.begin(ssid, password);
    delay(10000);
  }
  
  Serial.println("Connected to WiFi");
  printWiFiStatus();
}

void sendRFIDToServer(String uid) {
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["rfidUid"] = uid;
  doc["scannerId"] = "SK-2847"; // Can be modified to read from EEPROM
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Connect to server
  Serial.print("Connecting to server: ");
  Serial.println(serverName);
  
  if (client.connect(serverName, 80)) {
    Serial.println("Connected to server");
    
    // Send HTTP POST request
    String request = "POST /api/rfid HTTP/1.1\r\n";
    request += "Host: ";
    request += serverName;
    request += "\r\n";
    request += "Content-Type: application/json\r\n";
    request += "Content-Length: ";
    request += jsonString.length();
    request += "\r\n";
    request += "Connection: close\r\n";
    request += "\r\n";
    request += jsonString;
    
    client.print(request);
    
    // Wait for response
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
      }
    }
    
    client.stop();
    Serial.println("Disconnected from server");
  } else {
    Serial.println("Failed to connect to server");
  }
}

void printWiFiStatus() {
  // Print the SSID of the network
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // Print your board's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // Print the signal strength
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}
