const axios = require('axios');

async function sendMessage(to, text) {
  console.log(`[WHATSAPP] Sending message to ${to}: "${text.substring(0, 60)}..."`);
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text }
      },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
      }
    );
    console.log(`[WHATSAPP] Message sent successfully to ${to} | message_id: ${response.data?.messages?.[0]?.id}`);
  } catch (err) {
    if (err.response?.data?.error?.code === 131026) {
      console.warn(`[WHATSAPP] Sandbox recipient not opted in (${to}). Skipping reply.`);
      return;
    }
    console.error(`[WHATSAPP] Failed to send message to ${to}:`, err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendMessage };