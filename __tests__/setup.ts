// This file will be automatically loaded by Jest due to our setupFilesAfterEnv configuration

// Create a more complete mock of the browser API
const mockBrowser = {
  action: {
    setBadgeText: jest.fn(),
    onClicked: {
      addListener: jest.fn()
    }
  },
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    },
    onConnect: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    connect: jest.fn().mockReturnValue({
      name: 'content-script-connection',
      onDisconnect: {
        addListener: jest.fn()
      }
    })
  },
  tabs: {
    sendMessage: jest.fn(),
    query: jest.fn(),
    onUpdated: {
      addListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn().mockImplementation(() => Promise.resolve({ state: 'XL' })),
      set: jest.fn().mockImplementation(() => Promise.resolve())
    }
  },
  management: {
    onEnabled: {
      addListener: jest.fn()
    }
  },
  scripting: {
    executeScript: jest.fn()
  }
};

// Replace the jest-webextension-mock with our more complete mock
(global as any).browser = mockBrowser;
(global as any).chrome = mockBrowser;

// Mock document functions that might not be available in JSDOM
if (typeof document !== 'undefined') {
  // Only create head/body if they don't exist
  if (!document.head) {
    const head = document.createElement('head');
    document.appendChild(head);
  }
  
  if (!document.body) {
    const body = document.createElement('body');
    document.appendChild(body);
  }
}
