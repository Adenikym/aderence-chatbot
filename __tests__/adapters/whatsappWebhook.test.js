const { parseWebhook } = require('../../adapters/whatsappWebhook');

describe('WhatsApp Webhook Adapter', () => {
  test('parses a valid text message payload into an InboundMessage', () => {
    const rawPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    from: '2348001234567',
                    type: 'text',
                    text: {
                      body: 'hello world'
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const result = parseWebhook(rawPayload);

    expect(result).toEqual({
      participantPhone: '2348001234567',
      content: 'hello world',
      type: 'text'
    });
  });

  test('returns null for empty or invalid payloads', () => {
    expect(parseWebhook(null)).toBeNull();
    expect(parseWebhook({})).toBeNull();
    expect(parseWebhook({ object: 'whatsapp_business_account' })).toBeNull();
    expect(parseWebhook({ entry: [] })).toBeNull();
  });
});
