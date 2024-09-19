const express = require("express");
const app = express();
const Port = 1000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dynamically import the Gradio client library
const clientImport = async () => {
  const { Client } = await import("@gradio/client");
  return Client;
};

app.post("/play", async (req, res) => {
  try {
    // Extract the message (text) sent from Flutter
    const { message } = req.body;
    console.log("message", message);

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "No message provided",
      });
    }

    // Import the Gradio Client and connect to parler-tts
    const Client = await clientImport();
    const ttsClient = await Client.connect("parler-tts/parler_tts");

    // Use the TTS service to generate audio based on the message
    const result = await ttsClient.predict("/gen_tts", [
      message,
      message,
      true,
    ]);

    if (result && result.data) {
      const audioBase64 = result.data[0]; // Assuming result.data[0] is the base64-encoded audio

      console.log("daa", result);

      // Send the base64-encoded audio back to the Flutter client
      res.json({ success: true, audio: audioBase64 });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to generate audio",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
