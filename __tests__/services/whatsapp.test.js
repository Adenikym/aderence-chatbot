const axios = require('axios');
const { sendMessage } = require('../../services/whatsapp');

jest.mock('axios');

describe('sendMessage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, PHONE_NUMBER_ID: '12345', WHATSAPP_TOKEN: 'test-token' };
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('calls axios.post with v25.0 Graph API URL', async () => {
    axios.post.mockResolvedValue({ data: { messages: [{ id: 'msg1' }] } });

    await sendMessage('123', 'hello');

    expect(axios.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v25.0/12345/messages',
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('swallows 131026 Sandbox Error and resolves successfully', async () => {
    const sandboxError = new Error('Request failed with status code 400');
    sandboxError.response = {
      data: {
        error: {
          code: 131026,
          message: 'Message undeliverable',
        }
      }
    };
    axios.post.mockRejectedValue(sandboxError);

    await expect(sendMessage('123', 'hello')).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Sandbox recipient not opted in'));
  });

  it('throws on other API errors', async () => {
    const serverError = new Error('Internal Server Error');
    serverError.response = { data: { error: { code: 500 } } };
    axios.post.mockRejectedValue(serverError);

    await expect(sendMessage('123', 'hello')).rejects.toThrow('Internal Server Error');
  });
});
