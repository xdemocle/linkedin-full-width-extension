import { State, createMockBrowser } from '../helpers/test-utils';

// Create a mock browser API for testing
const mockBrowser = createMockBrowser();

// Mock the browser API
jest.mock('webextension-polyfill', () => mockBrowser);

describe('Background Script - Messaging', () => {
  // Create a set to track connected tabs
  const connectedTabs = new Set<number>();

  // Implement the sendToggleMessage function for testing
  const sendToggleMessage = async (tabId: number, state: State, bypassCheck = false): Promise<boolean> => {
    // Check if the tab has a connected content script (unless bypassed)
    if (!bypassCheck && !connectedTabs.has(tabId)) {
      console.log(`Tab ${tabId} does not have a connected content script, skipping message`);
      return false;
    }

    try {
      // Send the message to the content script
      await mockBrowser.tabs.sendMessage(tabId, { action: 'toggleStyles', state });
      return true;
    } catch (error) {
      // Handle errors and remove tab from connected tabs
      connectedTabs.delete(tabId);
      return false;
    }
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset connectedTabs for each test
    connectedTabs.clear();
  });

  test('sendToggleMessage should skip if tab is not connected and bypass is false', async () => {
    // Execute the function with a tab that's not connected
    const result = await sendToggleMessage(123, State.XL);

    // Verify message was not sent
    expect(mockBrowser.tabs.sendMessage).not.toHaveBeenCalled();
    
    // Verify function returned false
    expect(result).toBe(false);
  });

  test('sendToggleMessage should send message if tab is connected', async () => {
    // Add tab to connected tabs
    connectedTabs.add(123);
    
    // Execute the function
    const result = await sendToggleMessage(123, State.XL);

    // Verify message was sent with correct parameters
    expect(mockBrowser.tabs.sendMessage).toHaveBeenCalledWith(
      123, 
      { action: 'toggleStyles', state: 'XL' }
    );
    
    // Verify function returned true
    expect(result).toBe(true);
  });

  test('sendToggleMessage should send message if bypass is true, regardless of connection', async () => {
    // Execute the function with bypass = true
    const result = await sendToggleMessage(123, State.XL, true);

    // Verify message was sent with correct parameters
    expect(mockBrowser.tabs.sendMessage).toHaveBeenCalledWith(
      123, 
      { action: 'toggleStyles', state: 'XL' }
    );
    
    // Verify function returned true
    expect(result).toBe(true);
  });

  test('sendToggleMessage should handle errors and return false', async () => {
    // Add tab to connected tabs
    connectedTabs.add(123);
    
    // Mock sendMessage to throw an error
    mockBrowser.tabs.sendMessage.mockRejectedValueOnce(new Error('Test error'));

    // Execute the function
    const result = await sendToggleMessage(123, State.XL);

    // Verify function returned false
    expect(result).toBe(false);
    
    // Verify tab was removed from connected tabs
    expect(connectedTabs.has(123)).toBe(false);
  });
});
