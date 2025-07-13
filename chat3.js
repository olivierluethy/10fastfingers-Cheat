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

    let inputValue = document.getElementById("word-input").value = text;
  }, 'image/png');
})();
