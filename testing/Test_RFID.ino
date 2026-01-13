#include <SPI.h>
#include <MFRC522.h>

// --- YOUR PIN DEFINITIONS ---
#define SS_PIN   6    // SDA / CS
#define RST_PIN  7    // RST

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  while (!Serial) { ; }   // safe for boards with native USB

  SPI.begin();            // Uses hardware SPI:
                          // MISO = 11
                          // MOSI = 12
                          // SCK  = 13

  mfrc522.PCD_Init();
  Serial.println("RFID ready. Tap your card or fob.");
}

void loop() {
  // Check for new card
  if (!mfrc522.PICC_IsNewCardPresent()) return;

  // Read card UID
  if (!mfrc522.PICC_ReadCardSerial()) return;

  Serial.print("Tag detected! UID: ");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) Serial.print("0");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) Serial.print(":");
  }
  Serial.println();

  // Properly halt card
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  delay(300); // debounce
}
