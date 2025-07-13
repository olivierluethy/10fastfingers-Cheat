// === Konfigurierbare Wörter pro Minute ===
var WPM = 180; // <- Hier kannst du deine gewünschte Tippgeschwindigkeit einstellen

// === Umrechnung WPM in Millisekunden pro Wort ===
var intervalMs = 60000 / WPM;

var input = $('#inputfield')[0];
var ev = $.Event('keyup');
ev.which = 32;

setInterval(function() {
    if ($('.highlight')[0]) {
        input.focus();
        input.value = $('.highlight').text();
        $(input).trigger(ev);
    }
}, intervalMs);
