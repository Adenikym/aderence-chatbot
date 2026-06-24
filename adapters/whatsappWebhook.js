/**
 * Parses an incoming Meta WhatsApp webhook payload into a normalized InboundMessage.
 * 
 * @param {Object} body The raw JSON payload from Express req.body
 * @returns {Object|null} The normalized InboundMessage, or null if invalid
 */
function parseWebhook(body) {
  if (!body || typeof body !== 'object') return null;
  if (body.object !== 'whatsapp_business_account') return null;

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return null;

  if (message.type === 'text') {
    return {
      participantPhone: message.from,
      content: message.text?.body,
      type: 'text'
    };
  }

  // Future proofing for other types
  return null;
}

module.exports = { parseWebhook };
