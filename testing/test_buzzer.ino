#define BUZZER_PIN 8

void playApplePayStyleSound() {
  tone(BUZZER_PIN, 1047); // C6
  delay(120);
  noTone(BUZZER_PIN);
  delay(40);

  tone(BUZZER_PIN, 1319); // E6
  delay(160);
  noTone(BUZZER_PIN);

  delay(1680); // total ~2 seconds
}

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  playApplePayStyleSound();
  delay(3000);
}
