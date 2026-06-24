if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const app = express();
app.use(express.json());

const { handleMessage } = require("./flows/router");

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  console.log("[WEBHOOK] Verification request received");
  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    console.log("[WEBHOOK] Verification successful");
    res.send(req.query["hub.challenge"]);
  } else {
    console.warn("[WEBHOOK] Verification failed — token mismatch");
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("[WEBHOOK] Incoming POST:", JSON.stringify(body, null, 2));

  if (body.object === "whatsapp_business_account") {
    const { parseWebhook } = require("./adapters/whatsappWebhook");
    const inboundMessage = parseWebhook(body);
    
    if (inboundMessage) {
      console.log(
        `[WEBHOOK] Message from ${inboundMessage.participantPhone}: "${inboundMessage.content}"`,
      );
      try {
        await handleMessage(inboundMessage);
      } catch (err) {
        console.error("[WEBHOOK] Error handling message:", err);
      }
    } else {
      console.log(
        "[WEBHOOK] POST received but no valid message found (status update or other event)",
      );
    }
  } else {
    console.warn("[WEBHOOK] Unknown object type:", body.object);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
function startServer(port) {
  const server = app.listen(port, "0.0.0.0", async () => {
    console.log(`[SERVER] Running on port ${port}`);
    const { registerAllReminders } = require('./services/scheduler');
    await registerAllReminders();
  });

  process.on('SIGTERM', () => {
    console.log('[SERVER] SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('[SERVER] Process terminated');
    });
  });

  return server;
}

if (require.main === module) {
  startServer(PORT);
}

module.exports = { app, startServer };
