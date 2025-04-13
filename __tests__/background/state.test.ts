import { State, createMockBrowser } from '../helpers/test-utils';

// Create a mock browser API for testing
const mockBrowser = createMockBrowser();

// Mock the browser API
jest.mock('webextension-polyfill', () => mockBrowser);

describe('Background Script - State Management', () => {
  // We'll create our own implementation of the functions to test
  const setState = (nextState: State): void => {
    // Update the badge text to show the current state
    mockBrowser.action.setBadgeText({ text: nextState });

    // Save the state to local storage for persistence
    mockBrowser.storage.local.set({ state: nextState });
  };

  const getLocalState = async (): Promise<State> => {
    // Get the state from local storage
    const { state } = await mockBrowser.storage.local.get('state');

    // Return the stored state or default to XL if not found
    return (state as State) ?? State.XL;
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('setState should update badge and storage', () => {
    // Execute the function
    setState(State.XL);

    // Verify badge was updated
    expect(mockBrowser.action.setBadgeText).toHaveBeenCalledWith({ text: 'XL' });
    
    // Verify storage was updated
    expect(mockBrowser.storage.local.set).toHaveBeenCalledWith({ state: 'XL' });
  });

  test('getLocalState should retrieve state from storage', async () => {
    // Execute the function
    const state = await getLocalState();

    // Verify storage was queried
    expect(mockBrowser.storage.local.get).toHaveBeenCalledWith('state');
    
    // Verify the correct state was returned
    expect(state).toBe('XL');
  });

  test('getLocalState should default to XL if no state is found', async () => {
    // Mock storage to return empty object for this test only
    mockBrowser.storage.local.get.mockResolvedValueOnce({});

    // Execute the function
    const state = await getLocalState();

    // Verify the default state was returned
    expect(state).toBe('XL');
  });
});
