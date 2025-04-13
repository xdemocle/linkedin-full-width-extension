/**
 * LinkedIn Full Width Extension - Content Script
 *
 * This script handles the application of styles to LinkedIn pages based on the extension state.
 * It injects CSS directly into the page to toggle between default and full-width layouts.
 */
// Import the CSS styles from the external file
import linkedinFullWidthStyles from "./content.css?inline";

// WXT provides CSS as a module, so we need to convert it to a string

// Define the two possible states for the extension, matching the background script
export enum State {
  XL = "XL", // Full width mode
  M = "M", // Default LinkedIn width
}

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
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
        elementNewModule.classList.add("scaffold-layout-container");
        elementNewModule.classList.add("scaffold-layout-container--reflow");
      }
    };

    /**
     * Toggles the LinkedIn layout between default and full-width modes
     *
     * This function injects or removes a style element in the document head
     * with CSS that controls the width of LinkedIn's layout components.
     *
     * @param state - The state to apply (XL for full width, M for default width)
     */
    const toggleStyles = (state: State): void => {
      console.log(`Toggling styles to state: ${state}`);

      const styleId = "linkedin-full-width-style";

      // Always remove any existing style element first to avoid style conflicts
      const existingStyle = document.querySelector(`#${styleId}`);

      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }

      // For XL state (full width), create and inject a new style element
      // For M state (default), just removing the style element is sufficient
      if (state === State.XL) {
        // Create a new style element for full-width mode
        const style = document.createElement("style");
        style.id = styleId;
        console.log("Applying full-width styles (XL state)");

        // Use the imported CSS from the external file
        style.textContent = linkedinFullWidthStyles.toString();

        // Add the style element to the document head
        document.head.appendChild(style);
      } else {
        // For M state, we've already removed the custom styles
        // This allows LinkedIn's default styles to take effect
        console.log("Applying default LinkedIn layout (M state)");
        // No need to add any styles - LinkedIn defaults will apply
      }
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
      console.log("Initializing LinkedIn Full Width extension");

      // Some LinkedIn modules need special handling
      // Check if we're on one of these special pages
      const specialModules = ["mypreferences", "manage", "jobs"];
      const currentUrl = window.location.href;
      const isRegularPage = !specialModules.some((mod) =>
        currentUrl.includes(`/${mod}`)
      );

      // Apply special classes if we're on a regular LinkedIn page
      if (isRegularPage) {
        applyClassNamesToNewModules();
      }

      // Retrieve and apply the current extension state
      try {
        // Get the current state from browser storage
        const { state } = await browser.storage.local.get("state");

        console.log("Retrieved state from storage:", state);

        if (state) {
          // Apply the stored state
          toggleStyles(state as State);
        } else {
          // Default to XL (full width) if no state is found
          console.log("No state found in storage, defaulting to XL mode");

          toggleStyles(State.XL);
        }
      } catch (error) {
        // Handle any initialization errors
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error(
          "Error initializing LinkedIn Full Width extension:",
          errorMessage
        );
      }
    };

    /**
     * Listens for messages from the background script and handles them appropriately
     *
     * This listener processes messages to toggle styles.
     * It includes robust error handling and type checking for message safety.
     */
    browser.runtime.onMessage.addListener((message: unknown) => {
      console.log("Content script received message:", message);

      // First, ensure message is a valid object
      if (typeof message !== "object" || message === null) {
        console.log("Invalid message format received");

        return Promise.resolve({
          success: false,
          reason: "Invalid message format",
        });
      }

      // Handle style toggling messages
      if (
        "action" in message &&
        typeof message.action === "string" &&
        message.action === "toggleStyles" &&
        "state" in message
      ) {
        // Ensure state is valid
        const state = message.state === State.XL ? State.XL : State.M;
        console.log(`Applying state from message: ${state}`);

        try {
          // Apply the requested styles
          toggleStyles(state);

          console.log(`Successfully applied styles for state: ${state}`);

          return Promise.resolve({ success: true });
        } catch (error) {
          // Handle any errors during style application
          const errorMessage =
            error instanceof Error ? error.message : String(error);

          console.error(`Error applying styles: ${errorMessage}`);

          return Promise.resolve({ success: false, error: errorMessage });
        }
      }

      // Handle any unrecognized message types
      console.log("Unhandled message type received");

      return Promise.resolve({
        success: false,
        reason: "Unhandled message type",
      });
    });

    // Establish a connection with the background script
    const port = browser.runtime.connect({ name: "content-script-connection" });

    // Run the initialization
    initialize();

    // Notify background script that content script is ready
    browser.runtime
      .sendMessage({ action: "contentScriptReady" })
      .catch((error) => {
        console.error("Error notifying background script of readiness:", error);
      });
  },
});
