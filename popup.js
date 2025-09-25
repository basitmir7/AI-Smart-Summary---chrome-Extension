// When the popup button is clicked
document.getElementById("summarizeBtn").addEventListener("click", async () => {
    // Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Run content.js on the current page (extracts text & sends to background.js)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  
    // Show loading text
    document.getElementById("summary").innerText = "Summarizing... ⏳";
  });
  
  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "showSummary") {
      document.getElementById("summary").innerText = message.summary;
    }
  });
  