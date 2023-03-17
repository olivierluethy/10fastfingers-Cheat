// Get the input field element by its ID and assign it to a constant variable
const inputField = document.getElementById("inputfield");
// Create a new keyup event
const keyUpEvent = new Event('keyup');
// Set the key code of the keyup event to 32
keyUpEvent.keyCode = 32;

// Set an interval that executes the following function every 250 milliseconds
setInterval(() => {
    // Get the highlighted text by getting the first element with class 'highlight' and getting its text content
    const highlightedText = document.querySelector('.highlight').textContent;
    // If highlightedText is not an empty string
    if (highlightedText) {
        // Set the focus to the input field
        inputField.focus();
        // Set the value of the input field to the highlighted text
        inputField.value = highlightedText;
        // Dispatch the keyup event on the input field
        inputField.dispatchEvent(keyUpEvent);
    }
}, 250);
