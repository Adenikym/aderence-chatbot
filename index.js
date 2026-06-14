const express = require('express');
const app = express();
app.use(express.json());

const { handleMessage } = require('./flows/router');

// Webhook verification (Meta requires this)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Incoming messages
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object === 'whatsapp_business_account') {
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      await handleMessage(message);
    }
  }
  res.sendStatus(200); // Always 200 or Meta will retry
});

app.listen(3000, () => console.log('Server running on port 3000'));