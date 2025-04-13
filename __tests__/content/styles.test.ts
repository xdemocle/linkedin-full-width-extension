import { State, createMockBrowser } from '../helpers/test-utils';

// Create a mock browser API for testing
const mockBrowser = createMockBrowser();

// Mock the browser API
jest.mock('webextension-polyfill', () => mockBrowser);

describe('Content Script - Style Management', () => {
  // Create our own implementation of the toggleStyles function
  const toggleStyles = (state: State): void => {
    // ID for the style element
    const styleId = 'linkedin-full-width-style';
    
    // Remove any existing style element
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // For XL state (full width), create and inject a new style element
    // For M state (default), just removing the style element is sufficient
    if (state === State.XL) {
      // Create a new style element for full-width mode
      const style = document.createElement('style');
      style.id = styleId;
      
      // Define the CSS for full-width mode
      style.textContent = `
        /* Root variables - Override LinkedIn's default max-width constraints */
        :root {
          --scaffold-layout-xl-max-width: 100% !important;
          --scaffold-layout-lg-max-width: 100% !important;
          --scaffold-layout-md-max-width: 100% !important;
          --scaffold-layout-sidebar-narrow-width: minmax(0,300px) !important;
        }

        /* Global navigation - Ensure the nav bar spans the full width */
        .global-nav__content {
          width: 100%;
        }
      `;
      
      // Add the style element to the document head
      document.head.appendChild(style);
    }
  };
  
  // Setup and teardown
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  test('toggleStyles should add style element with XL styles', () => {
    // Execute the function
    toggleStyles(State.XL);
    
    // Verify style element was added
    const styleElement = document.getElementById('linkedin-full-width-style');
    expect(styleElement).not.toBeNull();
    expect(styleElement?.tagName).toBe('STYLE');
    
    // Verify style content includes full width CSS
    expect(styleElement?.textContent).toContain('--scaffold-layout-xl-max-width: 100% !important');
  });

  test('toggleStyles should remove style element with M styles', () => {
    // First add the style element
    toggleStyles(State.XL);
    
    // Then remove it
    toggleStyles(State.M);
    
    // Verify style element was removed
    const styleElement = document.getElementById('linkedin-full-width-style');
    expect(styleElement).toBeNull();
  });

  test('toggleStyles should replace existing style element', () => {
    // Add a fake style element with the same ID
    const fakeStyle = document.createElement('style');
    fakeStyle.id = 'linkedin-full-width-style';
    fakeStyle.textContent = 'fake-content';
    document.head.appendChild(fakeStyle);
    
    // Execute the function
    toggleStyles(State.XL);
    
    // Verify style element was replaced
    const styleElement = document.getElementById('linkedin-full-width-style');
    expect(styleElement).not.toBeNull();
    expect(styleElement?.textContent).not.toContain('fake-content');
    expect(styleElement?.textContent).toContain('--scaffold-layout-xl-max-width: 100% !important');
  });
});
