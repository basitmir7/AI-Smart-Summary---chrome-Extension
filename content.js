function extractPageText() {
    let articleText = document.body.innerText;
    return articleText.slice(0, 8000); // limit length for API
  }
  
  chrome.runtime.sendMessage({
    action: "summarize",
    text: extractPageText()
  });
  