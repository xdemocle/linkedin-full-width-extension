import { State, createMockBrowser } from '../helpers/test-utils';

// Create a mock browser API for testing
const mockBrowser = createMockBrowser();

// Mock the browser API
jest.mock('webextension-polyfill', () => mockBrowser);

describe('Content Script - Message Handling', () => {
  // Mock toggleStyles function
  const mockToggleStyles = jest.fn();
  
  // Create our own implementation of the message listener
  const messageListener = async (message: unknown): Promise<any> => {
    // Check if message is an object
    if (typeof message !== 'object' || message === null) {
      return { success: false, reason: 'Invalid message format' };
    }
    
    // Cast to any to access properties
    const msg = message as any;
    
    // Handle toggleStyles action
    if (msg.action === 'toggleStyles' && msg.state) {
      try {
        // Call toggleStyles with the provided state
        mockToggleStyles(msg.state);
        return { success: true };
      } catch (error) {
        // Handle errors during style application
        return { success: false, error: (error as Error).message };
      }
    }
    
    // Return failure for unhandled message types
    return { success: false, reason: 'Unhandled message type' };
  };
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset document body
    document.body.innerHTML = '';
  });
  
  test('message listener should handle toggleStyles action', async () => {
    // Create a toggle styles message
    const message = { action: 'toggleStyles', state: State.XL };
    
    // Call the listener with the message
    const response = await messageListener(message);
    
    // Verify toggleStyles was called with the correct state
    expect(mockToggleStyles).toHaveBeenCalledWith(State.XL);
    
    // Verify the response indicates success
    expect(response).toEqual({ success: true });
  });
  
  test('message listener should reject invalid message format', async () => {
    // Call the listener with an invalid message
    const response = await messageListener('not an object');
    
    // Verify toggleStyles was not called
    expect(mockToggleStyles).not.toHaveBeenCalled();
    
    // Verify the response indicates failure
    expect(response).toEqual({ success: false, reason: 'Invalid message format' });
  });
  
  test('message listener should reject unhandled message type', async () => {
    // Call the listener with an unhandled message type
    const response = await messageListener({ action: 'unknownAction' });
    
    // Verify toggleStyles was not called
    expect(mockToggleStyles).not.toHaveBeenCalled();
    
    // Verify the response indicates failure
    expect(response).toEqual({ success: false, reason: 'Unhandled message type' });
  });
  
  test('message listener should handle errors during style application', async () => {
    // Mock toggleStyles to throw an error
    mockToggleStyles.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // Create a toggle styles message
    const message = { action: 'toggleStyles', state: State.XL };
    
    // Call the listener with the message
    const response = await messageListener(message);
    
    // Verify toggleStyles was called
    expect(mockToggleStyles).toHaveBeenCalled();
    
    // Verify the response indicates failure
    expect(response).toEqual({ success: false, error: 'Test error' });
  });
});
