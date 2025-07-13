// Referenz zum Input-Feld
const inputElement = document.getElementById("word-input");

// === Tesseract.js laden (CDN) für Bildverarbeitung ===
const TESSERACT_CDN =
  "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js";

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

// === Bildverarbeitungsfunktionen aus dem 10fastfingers-Skript ===
function getBase64Image(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

function uriToImageData(uri) {
  return new Promise((resolve, reject) => {
    if (!uri) return reject(new Error("No URI provided"));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.addEventListener(
      "load",
      () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false
    );
    image.onerror = reject;
    image.src = uri;
  });
}

function getImageData(img) {
  const b64url = getBase64Image(img);
  return uriToImageData(b64url);
}

// === Funktion zur Verarbeitung eines Bildes mit Tesseract.js ===
async function processImageWithTesseract(imageElement) {
  try {
    const Tesseract = await loadTesseract();

    const worker = await Tesseract.createWorker();

    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const result = await worker.recognize(imageElement);

    console.log("📜 Tesseract Output:", result); // vollständige Ausgabe
    await worker.terminate();

    const text = result.data.text
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("📝 Extracted Text:", text); // nur erkannter Text
    return text;
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
  element.dispatchEvent(event);
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
async function start() {
  const imageElement = document.querySelector("#word-img img");
  if (!imageElement) {
    console.error("❌ CAPTCHA-Bild nicht gefunden!");
    return;
  }
  if (!inputElement) {
    console.error("❌ Eingabefeld nicht gefunden!");
    return;
  }

  // Warte, bis das Bild geladen ist
  if (imageElement.complete) {
    const textToType = await processImageWithTesseract(imageElement);
    if (textToType) {
      typeRealistic(textToType, inputElement);
    } else {
      console.error("❌ Kein Text aus dem Bild extrahiert!");
    }
  } else {
    imageElement.addEventListener("load", async () => {
      const textToType = await processImageWithTesseract(imageElement);
      if (textToType) {
        typeRealistic(textToType, inputElement);
      } else {
        console.error("❌ Kein Text aus dem Bild extrahiert!");
      }
    });
  }
}

start();
