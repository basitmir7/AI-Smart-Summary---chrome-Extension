chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "summarize") {
    const summary = await getSummary(message.text);
    chrome.runtime.sendMessage({ action: "showSummary", summary });
  }
});

 async function getSummary(text) {
  const apiKey = "YOUR API KEY; // ⚠️ replace with your Gemini key from Google AI Studio

  const modelName = "models/gemini-1.5-flash";  // Replace with one you find
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Summarize this text:\n\n${text}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini API response:", data);

    if (data.error) {
      return `⚠️ API Error: ${data.error.message}`;
    }
    if (!data.candidates || !data.candidates[0]) {
      return "⚠️ No summary returned. Try again.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return "⚠️ Failed to fetch summary.";
  }
}
