# Projektbericht: Texterkennung mit Tesseract.js in einem Anti-Cheat-System

## 🧠 Ziel des Projekts

Es sollte versucht werden, einen bereits existierenden Bot-Code von [10FastFingers Anti-Cheat Bot](https://github.com/FarisHijazi/10FastFingers_BotAntiAntiCheat/blob/master/10fastfingers_bot_antianticheat.user.js) auf das Funktionsprinzip des [Typeracer Hacks](https://github.com/BaskLash/typerracer-hack/blob/main/functioningTyping1.js) zu übertragen. Dabei sollte das Ziel sein, die Texteingabe möglichst realistisch zu simulieren, sodass die WPM (Words per Minute) korrekt an die jeweilige Plattform übertragen wird.

## 🧪 Erste Probleme

Der erste Versuch war zwar funktional, jedoch war die Genauigkeit der erkannten Texte ungenügend. Ein Screenshot-Test mit OCR auf der offiziellen Seite von **Tesseract** (neuste Version) zeigte jedoch sehr präzise Ergebnisse.

Daher entstand die Idee, den bestehenden Code auf die **neueste Tesseract-Version** umzustellen. Ziel war es, nicht den gesamten Code von Tesseract zu integrieren, sondern über eine URL-Importierung das Projekt sauber zu halten. 

## ⚠️ Kompatibilitätsprobleme

Die Migration auf Tesseract v5.0.4 stellte sich als schwierig heraus:

- Tesseract v1.0.14 arbeitete mit der Methode `worker.recognize` und unterstützte direkt `ImageData`.
- Die neuere Version v5.0.4 (und höher) setzt jedoch auf eine **worker-basierte API** mit strengeren Eingabeformaten.

### Fehlerursache

```text
Your getImageData function produces an ImageData object, which causes the error.

Your code uses Tesseract.js v5.1.0, which has a worker-based API (createWorker, setParameters, terminate) and stricter input requirements.
The 10fastfingers script uses v1.0.14, which is compatible with ImageData.
```

## ✅ Mögliche Lösungsansätze

* Verwende **Tesseract.js v1.0.14**, wenn du `ImageData` nutzen willst.
* Behalte die Funktionen `getBase64Image`, `uriToImageData`, `getImageData` aus dem Original bei.
* Entferne den statischen Whitelist-String (`'abcdefghijklmnopqrstuvwxyz'`) und nutze stattdessen: `a-zA-Z0-9,.`.
* Ersetze die `fillText`-Funktion durch deine eigene `typeRealistic`-Methode.
* Logge den vollständigen Output von Tesseract zur Analyse.
* Teste direkt auf der Anti-Cheat-Seite von 10FastFingers: [https://10fastfingers.com/anticheat/view](https://10fastfingers.com/anticheat/view)

## 📷 Bildverarbeitung im Vergleich

### Variante 1: Tesseract v1 mit Data URL

```js
function getBase64Image(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}
```

> ⚠️ Diese Variante greift auf die `src` des Bildes zu. Aus Sicherheitsgründen ist das jedoch nicht dasselbe Bild, das im Frontend angezeigt wird.

### Variante 2: Moderne Methode mit Tesseract.js v5

#### Ablauf:

1. Bild wird über `document.querySelector` erfasst.
2. Bild wird über `<canvas>` in ein `Blob` konvertiert.
3. `Tesseract.recognize()` liest Text aus dem `Blob`.
4. Ergebnis wird in der Konsole ausgegeben.

#### JavaScript-Snippet

```js
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
```

> ✅ Vorteil: Das Bild wird **direkt vom DOM-Element** verarbeitet – unabhängig von der `src`-URL.

## 💡 Fazit

* Eine zuverlässige Texterkennung mit **Tesseract.js v5** ist nur möglich, wenn das tatsächliche Bild aus dem DOM verarbeitet wird – nicht über die URL (`img.src`).
* Die Bilddaten müssen über `<canvas>` extrahiert und in ein kompatibles Format (Blob) konvertiert werden.
* Mit diesem Ansatz war die OCR-Erkennung erfolgreich und präzise.

## 🧠 Erkenntnis zum Lernprozess

> **"Endloses Herumfragen bei einer KI bringt wenig, wenn man das Problem seines Kollegen nicht wirklich versteht."**

* Es ist wichtig, **einen eigenen funktionierenden Lösungsansatz zu entwickeln**.
* Erst wenn man den Kontext versteht, kann man gezielt Lösungen mit einer KI erarbeiten.
* Die KI gibt dir nur zurück, was du ihr vorgibst – nicht, was du *eigentlich* suchst, wenn deine Eingaben ungenau sind.
* Ich habe zumal auch noch so gedacht, dass wenn mir jemand auf [YouTube](https://www.youtube.com/watch?v=k-Z25PRZY14) sagt, das etwas kompliziert und schwirig gewesen sei umzusetzen, dann hat er nicht verstanden wie es auch noch einfacher geht. Weil ansonsten hätte er nicht gesagt das es schwierig gewesen wäre. Zumal er mir so rüberkam als wüsse er wovon er spreche, aber eben, das war auch nur die halbe Miete des Geschehens.

---

**Projekt abgeschlossen ✅** – Ein funktionierender OCR-Bot mit realitätsnaher Eingabe-Simulation ist entstanden.