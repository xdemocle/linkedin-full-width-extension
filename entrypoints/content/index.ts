/**
 * LinkedIn Full Width Extension - Content Script
 *
 * This script handles the application of styles to LinkedIn pages based on the extension state.
 * It injects CSS directly into the page to toggle between default and full-width layouts.
 * 
 * It also injects a script into the page context for more reliable communication with the background script.
 */
import { targetWebsitePattern, State } from '../../web-extension-config';
import linkedinFullWidthStyles from './content.css?inline';

// WXT provides CSS as a module, so we need to convert it to a string

export default defineContentScript({
  matches: [targetWebsitePattern],
  main() {
    /**
     * Applies necessary CSS classes to new LinkedIn modules
     *
     * Some LinkedIn modules need specific classes to be properly styled.
     * This function identifies these modules and adds the required classes.
     */
    const applyClassNamesToNewModules = (): void => {
      // Find the new module element that needs classes applied
      const elementNewModule = document.querySelector('[tabindex="-1"]');

      // Add the required classes if the element exists
      if (elementNewModule) {
        elementNewModule.classList.add('scaffold-layout-container');
        elementNewModule.classList.add('scaffold-layout-container--reflow');
      }
    };

    /**
     * Toggles the LinkedIn layout between default and full-width modes
     *
     * This function injects or removes a style element in the document head
     * with CSS that controls the width of LinkedIn's layout components.
     * It also communicates with the injected script for more reliable state management.
     *
     * @param state - The state to apply (XL for full width, M for default width)
     */
    const toggleStyles = (state: State): void => {
      console.debug(`Toggling styles to state: ${state}`);

      const styleId = 'linkedin-full-width-style';

      // Always remove any existing style element first to avoid style conflicts
      const existingStyle = document.querySelector(`#${styleId}`);

      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }

      // For XL state (full width), create and inject a new style element
      // For M state (default), just removing the style element is sufficient
      if (state === State.XL) {
        // Create a new style element for full-width mode
        const style = document.createElement('style');
        style.id = styleId;
        console.debug('Applying full-width styles (XL state)');

        // Use the imported CSS from the external file
        style.textContent = linkedinFullWidthStyles.toString();

        // Add the style element to the document head
        document.head.appendChild(style);
      } else {
        // For M state, we've already removed the custom styles
        // This allows LinkedIn's default styles to take effect
        console.debug('Applying default LinkedIn layout (M state)');
        // No need to add any styles - LinkedIn defaults will apply
      }
      
      // Notify the injected script about the style change
      window.postMessage({
        source: 'linkedin-full-width-content',
        action: 'toggleStyles',
        state: state
      }, '*');
    };

    /**
     * Initializes the content script when it's first loaded
     *
     * This function performs initial setup tasks:
     * 1. Applies necessary classes to special LinkedIn modules
     * 2. Retrieves the current extension state from storage
     * 3. Applies the appropriate styles based on the state
     */
    const initialize = async (): Promise<void> => {
      console.log('Initializing LinkedIn Full Width extension');

      // Some LinkedIn modules need special handling
      // Check if we're on one of these special pages
      const specialModules = ['mypreferences', 'manage', 'jobs'];
      const currentUrl = window.location.href;
      const isRegularPage = !specialModules.some((mod) => currentUrl.includes(`/${mod}`));

      // Apply special classes if we're on a regular LinkedIn page
      if (isRegularPage) {
        applyClassNamesToNewModules();
      }

      // Retrieve and apply the current extension state
      try {
        // Get the current state from browser storage
        const { state } = await browser.storage.local.get('state');

        console.debug('Retrieved state from storage:', state);

        if (state) {
          // Apply the stored state
          toggleStyles(state as State);
        } else {
          // Default to XL (full width) if no state is found
          console.debug('No state found in storage, defaulting to XL mode');

          toggleStyles(State.XL);
        }
      } catch (error) {
        // Handle any initialization errors
        const errorMessage = error instanceof Error ? error.message : String(error);

        console.error('Error initializing LinkedIn Full Width extension:', errorMessage);
      }
    };

    /**
     * Listens for messages from the background script and handles them appropriately
     *
     * This listener processes messages to toggle styles.
     * It includes robust error handling and type checking for message safety.
     */
    browser.runtime.onMessage.addListener((message: unknown) => {
      console.debug('Content script received message:', message);

      // First, ensure message is a valid object
      if (typeof message !== 'object' || message === null) {
        console.error('Invalid message format received');

        return Promise.resolve({
          success: false,
          reason: 'Invalid message format',
        });
      }

      // Handle style toggling messages
      if (
        'action' in message &&
        typeof message.action === 'string' &&
        message.action === 'toggleStyles' &&
        'state' in message
      ) {
        // Ensure state is valid
        const state = message.state === State.XL ? State.XL : State.M;
        console.debug(`Applying state from message: ${state}`);

        try {
          // Apply the requested styles
          toggleStyles(state);

          console.debug(`Successfully applied styles for state: ${state}`);

          return Promise.resolve({ success: true });
        } catch (error) {
          // Handle any errors during style application
          const errorMessage = error instanceof Error ? error.message : String(error);

          console.error(`Error applying styles: ${errorMessage}`);

          return Promise.resolve({ success: false, error: errorMessage });
        }
      }

      // Handle any unrecognized message types
      console.warn('Unhandled message type received');

      return Promise.resolve({
        success: false,
        reason: 'Unhandled message type',
      });
    });

    // Inject our script into the page context for reliable communication
    const injectScript = document.createElement('script');
    // Use the browser API to get the URL of the inject-script.js file from the public directory
    // This ensures it works with the web_accessible_resources configuration
    injectScript.src = (browser as any).runtime.getURL('/inject-script.js');
    injectScript.onload = () => {
      console.debug('Injected script loaded successfully');
    };
    (document.head || document.documentElement).appendChild(injectScript);
    
    // Listen for messages from the injected script
    window.addEventListener('message', (event) => {
      // Validate the origin - only accept messages from the same window
      if (event.source !== window) {
        return;
      }
      
      const message = event.data;
      
      // Check if this is a message from our injected script
      if (message && message.source === 'linkedin-full-width-injected') {
        console.debug('Content script received message from injected script:', message);
        
        // Handle different message types
        if (message.action === 'injectedScriptReady') {
          console.debug('Injected script is ready');
          // Now that the injected script is ready, we can establish connection with background
          establishBackgroundConnection();
        } else if (message.action === 'heartbeat') {
          // Received heartbeat from injected script, relay to background
          browser.runtime.sendMessage({
            action: 'heartbeat',
            timestamp: message.timestamp
          }).catch(error => {
            console.error('Error sending heartbeat to background:', error);
            // Try to re-establish connection
            establishBackgroundConnection();
          });
        }
      }
    });
    
    // Function to establish connection with background script
    const establishBackgroundConnection = () => {
      try {
        // Make sure browser is defined and has runtime
        if (typeof browser !== 'undefined' && browser.runtime) {
          // Establish a connection with the background script
          const port = browser.runtime.connect({ name: 'content-script-connection' });
          
          // Handle disconnection
          port.onDisconnect.addListener(() => {
            console.warn('Connection to background script lost, attempting to reconnect...');
            // Wait a bit before trying to reconnect
            setTimeout(establishBackgroundConnection, 1000);
          });
          
          // Notify background script that content script is ready
          browser.runtime.sendMessage({ action: 'contentScriptReady' }).catch((error) => {
            console.error('Error notifying background script of readiness:', error);
          });
        } else {
          console.warn('Browser runtime not available, retrying in 1 second...');
          setTimeout(establishBackgroundConnection, 1000);
        }
      } catch (error) {
        console.error('Error establishing connection with background script:', error);
        // Try again after a delay
        setTimeout(establishBackgroundConnection, 1000);
      }
    };
    
    // Run the initialization
    initialize();
  },
});
