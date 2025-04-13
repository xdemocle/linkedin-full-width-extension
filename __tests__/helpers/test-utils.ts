// We don't need to import jest as it's globally available in test files

/**
 * State enum used across the extension
 */
export enum State {
  XL = 'XL',
  M = 'M',
}

/**
 * Creates a mock browser API for testing
 * @returns A mock browser API object
 */
export function createMockBrowser() {
  return {
    action: {
      setBadgeText: jest.fn(),
      onClicked: { addListener: jest.fn() }
    },
    runtime: {
      id: 'test-extension-id',
      onInstalled: { addListener: jest.fn() },
      onMessage: { addListener: jest.fn() },
      onConnect: { addListener: jest.fn() },
      sendMessage: jest.fn().mockResolvedValue({}),
      connect: jest.fn().mockReturnValue({
        onDisconnect: { addListener: jest.fn() }
      })
    },
    tabs: {
      sendMessage: jest.fn().mockResolvedValue({}),
      query: jest.fn(),
      onUpdated: { addListener: jest.fn() }
    },
    storage: {
      local: {
        get: jest.fn().mockResolvedValue({ state: 'XL' }),
        set: jest.fn().mockResolvedValue({})
      }
    },
    management: {
      onEnabled: { addListener: jest.fn() }
    },
    scripting: {
      executeScript: jest.fn()
    }
  };
}
