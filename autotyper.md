---

# ✨ Automatisiertes Tipper-Skript für 10fastfingers & Co.

> **Kompatibel mit**: [10fastfingers.com](https://10fastfingers.com), socialtypingtest.de, uvm.
> **Ursprünglich modifiziert von**: [DavidMellul/10fastfingers-hack](https://github.com/DavidMellul/10fastfingers-hack)

---

## 📌 Zweck

Dieses Skript simuliert realistische Texteingaben auf Tipp-Plattformen wie **10fastfingers** mit einer **konfigurierbaren WPM-Zielgeschwindigkeit**. Dabei wird jedes Wort **buchstabenweise** eingegeben und am Ende **die Leertaste als echter Tastendruck** simuliert – ganz so, als würde ein Mensch selbst tippen.

---

## ⚙️ Funktionsweise

1. **Ziel-WPM einstellen**:

   ```js
   var targetWPM = 170;
   ```

   Das Skript berechnet daraus die benötigte **Verzögerung pro Tastenanschlag**, um die Geschwindigkeit realistisch zu halten.

2. **Textaufnahme**:
   Alle Wörter aus dem aktuellen Eingabeabschnitt (`#row1 span`) werden gesammelt und nacheinander abgearbeitet.

3. **Echtzeit-Tastensimulation**:
   Jeder Buchstabe eines Wortes wird einzeln ins Eingabefeld geschrieben. Am Ende des Wortes wird die **Leertaste (Space)** via `KeyboardEvent` simuliert, um ein authentisches Tipperlebnis zu erzeugen.

4. **Dynamische Zeitkorrektur**:
   Um Schwankungen und Über- bzw. Unterschreitung der Ziel-WPM zu vermeiden, wird der Delay nach jedem Buchstaben **neu berechnet**:

   * Wie viele Zeichen noch zu tippen sind?
   * Wie viel Zeit bleibt, um das Ziel-WPM zu erreichen?

   Diese Logik basiert auf einem **physikalischen Modell**, das dem Prinzip der "gleichmäßigen Energieverteilung über Zeit" ähnelt.

5. **Eingabe-Abbruch bei Ergebnissen**:
   Sobald das Ergebnisfeld eingeblendet wird (`#auswertung-result`, `#ergebnis`, `#ans_result`), **stoppt das Skript automatisch**, um keine unnötige Eingabe mehr zu simulieren.

---

## 💡 Hintergedanken & Ideen

* **Realistische Eingabe**: Statt das gesamte Wort auf einmal einzufügen, wird wirklich **Buchstabe für Buchstabe** getippt – inklusive simuliertem `keyup` der Leertaste.
* **Anpassungsfähig**: Das Skript funktioniert plattformübergreifend, solange das Eingabefeld `#inputfield` und die Wörter in `#row1 span` definiert sind.
* **Reaktionsfähig auf Änderungen**: Es berücksichtigt z. B. Großbuchstaben mit doppeltem Aufwand oder Stopps bei sichtbarem Ergebnis.
* **WPM-Korrektur während der Laufzeit**: Selbst wenn ein paar Zeichen schneller oder langsamer geschrieben wurden, korrigiert das Skript automatisch die zukünftige Eingabezeit.

---

## ▶️ Nutzung

1. Öffne die Tippseite (z. B. 10fastfingers.com).
2. Öffne die **Browser-Konsole (F12)**.
3. Füge den gesamten Script-Code ein und führe ihn aus (`Enter`).
4. Die Eingabe startet automatisch.

---

## ⚠️ Hinweis

Dieses Skript dient **ausschließlich zu Lern- und Testzwecken**. Es kann helfen, das Verhalten von Tipp-Plattformen zu analysieren oder Eingabe-Simulationen für Usability-Tests zu erzeugen. Missbrauch (z. B. zur Manipulation von Ranglisten) ist ausdrücklich **nicht empfohlen**.

---