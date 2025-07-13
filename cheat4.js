/* Als erstes wurde versucht von diesem Code (https://github.com/FarisHijazi/10FastFingers_BotAntiAntiCheat/blob/master/10fastfingers_bot_antianticheat.user.js) eine Ableitung zu diesem hier https://github.com/BaskLash/typerracer-hack/blob/main/functioningTyping1.js) zu schaffen, damit sich die Eingabewerte also die Eingaben in das Inputfeld sich möglichst realistisch und mit der darauf korrekt übertragenen WPM auf die Webseite übertragen wird.
 Allerdings hat das nicht gut funktioniert, also ja schon aber die Genauigkeit der Werte welches dieses Programm ausgewertet hat völlig ungenügend waren. Da ich durch einem Test, mittels Screenshot auf das Bild und es dann auf die offizielle Seite von Tesseract eingefügt habe
 welches mit der neusten Tesseract version arbeitete musste ich feststellen, dass es alle diese Werte bis auf kleinste Details immer korrekt erkannt hat. Daraufhin wollte ich diese eine Codeversion in die neuste Tesseract version umwandeln, mit zugleichen Projektimportierung mittels URL
 und nicht einfach den gesamten Code von Tesseract in diesen Code einfügen da es ansonsten zu unübersichtlich hätte werden können. Allerdings stellte sich dabei heraus, dass dies gar nicht so einfach geht.
 Den zwischen Tesseract Version v1.0.14 und v5.0.4 erhebliche Kompatibilitätsprobleme geherrscht haben und zwar hat das mit der älteren Version für die Erkennung des Bildes die Methode worker.recognize mit der Methode ImageData objects gearbeitet hat, was mit der neusten Version nicht funktioniert.

Your getImageData function produces an ImageData object, which causes the error.

Your code uses Tesseract.js v5.1.0, which has a worker-based API (createWorker, setParameters, terminate) and stricter input requirements. The 10fastfingers script uses v1.0.14, which is compatible with ImageData.

Use Tesseract.js v1.0.14 (embedded from the 10fastfingers script) instead of v5.1.0 to ensure compatibility with ImageData inputs.
Retain the getBase64Image, uriToImageData, and getImageData functions from the 10fastfingers script for image processing.
Remove the explicit abcdefghijklmnopqrstuvwxyz string from the tessedit_char_whitelist, replacing it with a-zA-Z0-9,. to handle typical CAPTCHA characters.
Integrate your typeRealistic function for typing simulation, replacing the original fillText function.
Log the full Tesseract output and extracted text to the console for debugging.
Ensure the script works on the 10fastfingers anti-cheat page (https://10fastfingers.com/anticheat/view).

Allerdings hat dies ebenfalls nicht sauber funktioniert. Es hat zwar einen Text ausgeben können, aber dieser las danach den Text von der Bild URL:
function getBase64Image(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

Aber das Bild von der URL des angezeigten Bildes, war wiederum nie das gleiche wie das was im Frontend angezeigt wird aus sicherheitsgründen. Was ich mir dann gedacht habe ist, dass es also in dem Sinne her nicht hilft, sich irgendwie das Bild aus der URL irgendwie rauszuholen zu lassen, oder irgendwie mit der URL komisch herumzuspielen wie das mit dem Code welches eine ältere Tesseract version benutzt, sondern man muss das Bild irgendwie herauskriegen welches direkt auf der Webseite geladen wird und nicht mit der URL des Bildes zugreift oder zutun kriegt, weil sonst sind die Bildinformationen wieder falsch. Ich brauchte dafür einen Weg, die Daten von diesem Bild zu holen ohne auf die src zuzugreifen sodass sie gleichzeitig für tesseract 5 kompatible ist. 
✅ Was das Script macht:
1. Holt das Bild über document.querySelector.

2. Lädt es in ein <canvas>, um das Bild in ein Blob zu konvertieren.

3. Nutzt Tesseract.js, um den Text aus dem Bild zu extrahieren.

4. Gibt das Ergebnis in der Konsole aus.

📜 JavaScript-Snippet:
(async () => {
  // Tesseract.js laden (wenn noch nicht vorhanden)
  if (typeof Tesseract === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => script.onload = resolve);
  }

  // Bild finden
  const img = document.querySelector('#word-img img');
  if (!img) {
    console.error('Kein Bild mit Selektor #word-img img gefunden.');
    return;
  }

  // Bild in Canvas laden
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // In Blob konvertieren
  canvas.toBlob(async (blob) => {
    if (!blob) {
      console.error('Fehler beim Konvertieren des Bildes.');
      return;
    }

    console.log('📷 Starte Texterkennung mit Tesseract...');
    const { data: { text } } = await Tesseract.recognize(blob, 'eng');
    console.log('📝 Erkannter Text:');
    console.log(text);
  }, 'image/png');
})();

Im Verhältnis zu diesem hier:
// === Bildverarbeitungsfunktionen aus dem 10fastfingers-Skript ===
function getBase64Image(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

Wie man hierbei ganz klar und offen sieht, werden hierbei die Bilddaten auf unterschieldicher Weise geholt.
Beim einen werden die Daten über die Data URL also die Src des bildes geholt und verarbeitet und beim zweiten wird ein Canva daraus gemacht welches konvertiert wird in ein Format welches für die neuste version von Tesseract kompatibel ist.

Weil mein Ansatzpunkt damit war so, dass es doch irgendwie möglich sein muss die Daten aus einem Img Tags zu holen und diese verarbeiten zu können um aus diesen Werten etwas zu machen. Es erklänge für mich sowieso nicht logisch, müsste man die Bilderdaten von einem img Tag also von der src beachten woher sie kommt, damit man mit diesem Bild etwas anfangen kann.
Aber das muss man schliesslich ja nicht, was ja das Gute dabei ist und so habe ich im schlussement die Challenge auch gelöst.

Wichtiger ansatzpunkt: Endloses herumgequatsche mit einer KI bringt einem nichts weiter, wenn man den ansatzpunkt des kollegen nicht versteht, und sich daher selbst nicht einen aufbaut. Wenn man für sich selbst sich einen erschafft der Funktioniert, wird es danach sehr viel Leichter weiterzukommen und die Mission abzuschliessen, anstatt immer ständig um den kreis mit der KI zu drehen. Den die KI weiss nur was du ihr gibst, aber nicht was du von deinen angaben von ihr erwartet, weil dafür bräuchte es ja deinen wichtigen präzisen angaben um auf diese Erwartung zu stossen.

*/
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
    } = await Tesseract.recognize(blob, "eng");
    const cleanText = text.replace(/\s+/g, " ").trim(); // Optional: Bereinigung
    console.log("📝 Erkannter Text:", cleanText);

    // === Automatisches Tippen mit realistischer WPM-Simulation ===

    // Konfiguration
    const MAX_WPM = 150;
    const BRAKE_WPM = 60;
    const TARGET_WPM = 103;

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

    function calculateBrakeIndex(totalChars, maxWPM, brakeWPM, targetWPM) {
      const n = totalChars;
      const A = 1 / maxWPM;
      const B = 1 / brakeWPM;
      const C = 1 / targetWPM;

      const numerator = B * n - C * n;
      const denominator = B - A;

      const x = Math.round(numerator / denominator);
      return Math.min(Math.max(x, 0), n);
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

    function typeSmartControlled(text, inputElement) {
      const totalChars = text.length;
      const brakeIndex = calculateBrakeIndex(
        totalChars,
        MAX_WPM,
        BRAKE_WPM,
        TARGET_WPM
      );
      console.log(
        `✏️ Gesamtzeichen: ${totalChars}, Bremsbeginn bei Zeichen: ${brakeIndex}`
      );

      let i = 0;

      function typeNextChar() {
        if (i < text.length) {
          const char = text[i];
          const currentWPM = i < brakeIndex ? MAX_WPM : BRAKE_WPM;
          const delay = getDelayFromWPM(currentWPM);

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
    typeSmartControlled(cleanText, inputElement);
  }, "image/png");
})();
