// -- ID is added automatically after running to the input field by searching for class where input field is inside, locate input field and add an ID to it --
// Select the input field inside the element with class "interface"
const inputField = document.querySelector('.interface input');

// If the input field exists, assign the id "inputfield" to it
if (inputField) {
  inputField.id = "inputfield";
}

function getRandomInterval() {
  // Generate a random number between 100 (inclusive) and 400 (exclusive)
  return Math.floor(Math.random() * (800 - 100)) + 100;
}

// Set an interval that executes the following function with a random interval
const intervalId = setInterval(() => {
  // Get the highlighted text by getting the first element with class 'highlight' and getting its text content
  const highlightedText = document.querySelector('.highlight').textContent;

  // If highlightedText is not an empty string
  if (highlightedText) {
    // Set the focus to the input field
    inputField.focus();

    // Set the value of the input field to the highlighted text + space
    inputField.value = highlightedText + ' ';

    // Dispatch an 'input' event to notify the change in the input field
    const inputEvent = new Event('input', { bubbles: true });
    inputField.dispatchEvent(inputEvent);
  }
}, getRandomInterval());

// Optionally, clear the interval when the input field loses focus
inputField.addEventListener('blur', () => {
  clearInterval(intervalId);
});
