// Looked up from: https://www.youtube.com/watch?v=k-Z25PRZY14
// Approch using Tesseract from this: https://github.com/FarisHijazi/10FastFingers_BotAntiAntiCheat

(async () => {
  // === OCR Schritt mit Tesseract.js ===
  if (typeof Tesseract === "undefined") {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js";
    document.head.appendChild(script);
    await new Promise((resolve) => (script.onload = resolve));
  }

  const img = document.querySelector("#word-img img");
  if (!img) {
    console.error("Kein Bild mit Selektor #word-img img gefunden.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(async (blob) => {
    if (!blob) {
      console.error("Fehler beim Konvertieren des Bildes.");
      return;
    }

    console.log("📷 Starte Texterkennung mit Tesseract...");
    const {
      data: { text },
    } = await Tesseract.recognize(blob, "vie"); // Set here the correct language: https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html
    const cleanText = text.replace(/\s+/g, " ").trim(); // Optional: Bereinigung
    console.log("📝 Erkannter Text:", cleanText);

    // === Automatisches Tippen mit konstanter WPM ===
    const TARGET_WPM = 270; // <- Hier kannst du deine gewünschte konstante WPM setzen -> 199

    const inputElement =
      document.querySelector(".txtInput") ||
      document.getElementById("word-input");
    if (!inputElement) {
      console.error("❌ Kein Eingabefeld gefunden.");
      return;
    }

    function getDelayFromWPM(wpm) {
      const charsPerMinute = wpm * 5;
      const charsPerSecond = charsPerMinute / 60;
      return 1000 / charsPerSecond;
    }

    function dispatchKeyboardEvent(element, type, key) {
      const event = new KeyboardEvent(type, {
        key: key,
        code: key,
        charCode: key.charCodeAt(0),
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(event);
    }

    function dispatchInputEvent(element, value) {
      const inputEvent = new InputEvent("input", {
        data: value,
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
      });
      element.dispatchEvent(inputEvent);
    }

    function typeConstantSpeed(text, inputElement) {
      const delay = getDelayFromWPM(TARGET_WPM);
      let i = 0;

      function typeNextChar() {
        if (i < text.length) {
          const char = text[i];

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
          document.getElementById("submit-anticheat").click();
        }
      }

      typeNextChar();
    }

    // Starte den Tippvorgang
    typeConstantSpeed(cleanText, inputElement);
  }, "image/png");
})();
