// -- First try, where id must be added separately inside the input field html --

// Get the input field element by its ID and assign it to a constant variable
const inputField = document.getElementById("inputfield");

// Set an interval that executes the following function every 250 milliseconds
setInterval(() => {
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
}, 250);
