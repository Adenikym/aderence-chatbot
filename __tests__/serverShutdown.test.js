const { app, startServer } = require('../index');

describe('startServer graceful shutdown', () => {
  let originalOn;
  let serverMock;

  beforeEach(() => {
    originalOn = process.on;
    process.on = jest.fn();
    serverMock = { close: jest.fn((cb) => cb && cb()) };
    app.listen = jest.fn().mockReturnValue(serverMock);
  });

  afterEach(() => {
    process.on = originalOn;
  });

  it('listens for SIGTERM and closes the server gracefully', () => {
    startServer(3000);

    expect(process.on).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    
    // Extract the registered handler
    const sigtermHandler = process.on.mock.calls.find(call => call[0] === 'SIGTERM')[1];
    
    // Trigger the handler
    sigtermHandler();

    expect(serverMock.close).toHaveBeenCalled();
  });
});
