// Global type definitions for browser extensions

interface BrowserAPI {
  action: {
    setBadgeText: (details: { text: string }) => void;
    onClicked: {
      addListener: (callback: Function) => void;
    };
  };
  runtime: {
    id: string;
    onInstalled: {
      addListener: (callback: Function) => void;
    };
    onMessage: {
      addListener: (callback: Function) => void;
    };
    onConnect: {
      addListener: (callback: Function) => void;
    };
    sendMessage: (message: any) => Promise<any>;
    connect: (details: any) => {
      name: string;
      onDisconnect: {
        addListener: (callback: Function) => void;
      };
    };
  };
  tabs: {
    sendMessage: (tabId: number, message: any) => Promise<any>;
    query: (queryInfo: any) => Promise<any[]>;
    onUpdated: {
      addListener: (callback: Function) => void;
    };
  };
  storage: {
    local: {
      get: (key: string) => Promise<any>;
      set: (data: any) => Promise<void>;
    };
  };
  management: {
    onEnabled: {
      addListener: (callback: Function) => void;
    };
  };
  scripting: {
    executeScript: (details: any) => Promise<any>;
  };
}

// Extend the global namespace to include browser and chrome
declare global {
  var browser: BrowserAPI;
  var chrome: BrowserAPI;
}

export {};
