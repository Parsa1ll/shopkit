#define RGB_PIN 9

void setup() {
  pinMode(RGB_PIN, OUTPUT);
}

void loop() {
  // RED
  analogWrite(RGB_PIN, 255);   // full brightness
  delay(1000);

  // GREEN
  analogWrite(RGB_PIN, 0);     // different duty = different color
  delay(1000);
}
