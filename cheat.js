// Zieltext, der eingegeben werden soll
const textToType = ""; // Should be given by the retrieved text from tesseract

// Referenz zum Input-Feld
const inputElement = document.getElementById("word-input");

// === Tesseract.js laden (CDN) für Bildverarbeitung ===
const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js";

// === Funktion zum Laden von Tesseract.js ===
function loadTesseract() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_CDN;
    script.onload = () => resolve(window.Tesseract);
    script.onerror = () => reject(new Error("Failed to load Tesseract.js"));
    document.head.appendChild(script);
  });
}

// === Funktion zur Verarbeitung eines Bildes mit Tesseract.js ===
// Extrahiert Text aus einem Bild (z.B. Screenshot des Textpanels)
async function processImageWithTesseract(imageSource) {
  try {
    const Tesseract = await loadTesseract();
    const worker = await Tesseract.createWorker("eng"); // Englisch als Sprache
    const { data: { text } } = await worker.recognize(imageSource);
    await worker.terminate();
    // Bereinige den extrahierten Text: Entferne Zeilenumbrüche und überflüssige Leerzeichen
    return text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("❌ Fehler bei der Bildverarbeitung:", error);
    return "";
  }
}

// Funktion zur Berechnung der Verzögerung (ms pro Zeichen) basierend auf WPM
function getDelayFromWPM(wpm) {
  const charsPerMinute = wpm * 5; // Durchschnittlich 5 Zeichen pro Wort
  const charsPerSecond = charsPerMinute / 60;
  return 1000 / charsPerSecond;
}

// Funktion zur Simulation eines Tastaturevents
function dispatchKeyboardEvent(element, type, key) {
  const event = new KeyboardEvent(type, {
    key: key,
    code: `Key${key.toUpperCase()}`,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

// Funktion zur Simulation eines Input-Events
function dispatchInputEvent(element, value) {
  const inputEvent = new InputEvent("input", {
    data: value,
    bubbles: true,
    cancelable: true,
    inputType: "insertText",
  });
  element.dispatchEvent(inputEvent);
}


// Hauptfunktion: Simuliert das Tippen mit variablen Verzögerungen
function typeRealistic(text, inputElement) {
  let i = 0;

  function typeNextChar() {
    if (i < text.length) {
      const char = text[i];
      // Zufällige WPM zwischen 80 und 120 für realistisches Tippen
      const wpm = Math.floor(Math.random() * (120 - 80 + 1)) + 80;
      const delay = getDelayFromWPM(wpm);

      inputElement.focus();
      dispatchKeyboardEvent(inputElement, "keydown", char);
      dispatchKeyboardEvent(inputElement, "keypress", char);
      inputElement.value += char;
      dispatchInputEvent(inputElement, char);
      dispatchKeyboardEvent(inputElement, "keyup", char);

      i++;
      setTimeout(typeNextChar, delay);
    } else {
      console.log("✅ Eingabe abgeschlossen!");
    }
  }

  typeNextChar();
}

// Script starten
typeRealistic(textToType, inputElement);