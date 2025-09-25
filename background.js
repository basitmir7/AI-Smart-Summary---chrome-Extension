chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "summarize") {
      const summary = await getSummary(message.text);
      chrome.runtime.sendMessage({ action: "showSummary", summary });
    }
  });
  
  async function getSummary(text) {
    const apiKey = "YOUR_OPENAI_API_KEY"; // replace with your real key
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",  // ✅ make sure your account has access to this
          messages: [
            { role: "system", content: "You are a summarizer that returns a TL;DR and bullet points." },
            { role: "user", content: `Summarize this text:\n\n${text}` }
          ],
          max_tokens: 250
        })
      });
  
      const data = await response.json();
      console.log("API response:", data); // log the full API response
  
      if (data.error) {
        return `⚠️ API Error: ${data.error.message}`;
      }
  
      if (!data.choices || !data.choices[0]) {
        return "⚠️ No summary returned. Check API key or model.";
      }
  
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching summary:", error);
      return "⚠️ Failed to fetch summary. Check API key and network.";
    }
  }
  