// Modified from this
// https://github.com/DavidMellul/10fastfingers-hack

// Kompatibel: All

// Wunschgeschwindigkeit
var targetWPM = 170; // If 190 => real speed 184 | If 200 => real speed 195
var keystrokesPerWord = 5;
var msPerKeystroke = 60000 / (targetWPM * keystrokesPerWord);

var input = document.getElementById("inputfield");
var words = Array.from(document.querySelectorAll("#row1 span")).map(
  (el) => el.innerText
);
var totalKeystrokes = 0;
var startTime = null;
var totalExpectedKeystrokes = words.reduce(
  (sum, word) => sum + word.length + 1,
  -1
); // Alle Buchstaben + Leertasten (letzte ausgenommen)

// Leertaste
var spaceEvent = new KeyboardEvent("keyup", {
  key: " ",
  keyCode: 32,
  which: 32,
  bubbles: true,
});

// WPM-Berechnung
function calculateWPM(keystrokes, timeMs) {
  if (timeMs === 0) return 0;
  return Math.round(keystrokes / keystrokesPerWord / (timeMs / 60000));
}

// Sichtbarkeit des Ergebniselements prüfen
function isResultVisible() {
  const el1 = document.getElementById("auswertung-result");
  const el2 = document.getElementById("ergebnis");
  const el3 = document.getElementById("ans_result");

  // For 10fastfingers
  const isEl1Visible = el1 && window.getComputedStyle(el1).display !== "none";
  const isEl2Visible = el2 && window.getComputedStyle(el2).display !== "none";
  // For socialtypingtest
  const isEl3Visible = el3 && window.getComputedStyle(el3).display !== "none";

  return isEl1Visible || isEl2Visible || isEl3Visible;
}

// Geschwindigkeit anpassen (physikalische Analogie)
function adjustKeystrokeDelay(wordIndex) {
  if (!startTime) return msPerKeystroke;
  let elapsedTime = Date.now() - startTime;
  let remainingKeystrokes = totalExpectedKeystrokes - totalKeystrokes;
  if (remainingKeystrokes <= 0) return 10;

  // Gesamtzeit für das Ziel-WPM
  let totalExpectedTime =
    (totalExpectedKeystrokes / keystrokesPerWord) * (60000 / targetWPM);
  let remainingTime = totalExpectedTime - elapsedTime;

  if (remainingTime <= 0) return 10;

  // Erforderlicher Delay
  let requiredDelay = remainingTime / remainingKeystrokes;
  let adjustedDelay = Math.max(10, Math.min(300, requiredDelay));

  console.log(`⚙️ Erforderlicher Delay: ${adjustedDelay.toFixed(2)}ms`);
  return adjustedDelay;
}

// Buchstabenweise Eingabe
function typeLetter(word, letterIndex, wordIndex, doneCallback) {
  if (isResultVisible()) return;
  if (letterIndex < word.length) {
    input.value += word[letterIndex];
    totalKeystrokes += /[A-ZÄÖÜ]/.test(word[letterIndex]) ? 2 : 1;
    msPerKeystroke = adjustKeystrokeDelay(wordIndex); // Anpassung nach jedem Buchstaben
    setTimeout(
      () => typeLetter(word, letterIndex + 1, wordIndex, doneCallback),
      msPerKeystroke
    );
  } else {
    input.value += " ";
    totalKeystrokes += 1;
    input.dispatchEvent(spaceEvent);
    msPerKeystroke = adjustKeystrokeDelay(wordIndex);
    setTimeout(doneCallback, msPerKeystroke);
  }
}

// Wortweise Eingabe
function typeWordsSequentially(index) {
  if (isResultVisible()) {
    console.log("🛑 Vorgang abgebrochen – Ergebnis wurde eingeblendet.");
    return;
  }

  if (index >= words.length) {
    let totalTime = Date.now() - startTime;
    let finalWPM = calculateWPM(totalKeystrokes, totalTime);
    console.log(`✅ Alle Wörter eingegeben. Tatsächlicher WPM: ${finalWPM}`);
    return;
  }

  let word = words[index];
  if (index === 0) startTime = Date.now();

  console.log(`📥 Starte Eingabe von Wort #${index + 1}: "${word}"`);

  input.focus();
  input.value = "";

  typeLetter(word, 0, index, () => {
    typeWordsSequentially(index + 1);
  });
}

// Start
typeWordsSequentially(0);
