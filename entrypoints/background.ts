/**
 * LinkedIn Full Width Extension - Background Script
 *
 * This script manages the extension state and handles communication with content scripts.
 * It uses the browser.* APIs from the WebExtension Polyfill for cross-browser compatibility.
 */

import { type Browser } from 'wxt/browser';

// LinkedIn domain and URL patterns for querying tabs
export const targetWebsite = 'https://www.linkedin.com';

// Define the two possible states for the extension
export enum State {
  XL = 'XL', // Full width mode
  M = 'M', // Default LinkedIn width
}

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  const queryTabsUrls = [`${targetWebsite}/*`];

  // Set to track tabs with active content scripts
  const connectedTabs = new Set<number>();

  /**
   * Sets the extension state and updates the browser action badge
   *
   * @param nextState - The state to set (XL or M)
   */
  const setState = (nextState: State): void => {
    // Update the badge text to show the current state
    browser.action.setBadgeText({ text: nextState });

    // Save the state to local storage for persistence
    browser.storage.local.set({ state: nextState });
  };

  /**
   * Retrieves the current extension state from storage
   *
   * @returns Promise resolving to the current state (defaults to XL if not set)
   */
  const getLocalState = async (): Promise<State> => {
    // Get the state from local storage
    const { state } = await browser.storage.local.get('state');

    // Return the stored state or default to XL if not found
    return (state as State) ?? State.XL;
  };

  /**
   * Sends a message to the content script to toggle styles
   *
   * This function sends a message to a tab to apply the specified state.
   * It only sends messages to tabs that have registered their content scripts,
   * unless bypassCheck is set to true (used during initial injection).
   *
   * @param tabId - The ID of the tab to send the message to
   * @param state - The state to apply (XL or M)
   * @param bypassCheck - Whether to bypass the connection check (default: false)
   * @returns Promise resolving to a boolean indicating success
   */
  const sendToggleMessage = async (tabId: number, state: State, bypassCheck = false): Promise<boolean> => {
    // Check if the tab has a connected content script (unless bypassed)
    if (!bypassCheck && !connectedTabs.has(tabId)) {
      console.log(`Tab ${tabId} does not have a connected content script, skipping message`);
      return false;
    }

    try {
      // Send the message to the content script
      console.log(`Sending toggle message to tab ${tabId} with state ${state}`);

      await browser.tabs.sendMessage(tabId, { action: 'toggleStyles', state });

      console.log(`Successfully sent message to tab ${tabId}`);
      return true;
    } catch (error) {
      // Handle errors (typically when content script isn't loaded yet)
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.error(`Error sending message to tab ${tabId}: ${errorMessage}`);

      // If we get an error, the content script might have been unloaded
      // Remove it from our connected tabs set
      connectedTabs.delete(tabId);

      return false;
    }
  };

  /**
   * Listens for connections from content scripts
   *
   * This allows us to track which tabs have active content scripts.
   */
  browser.runtime.onConnect.addListener((port: Browser.runtime.Port) => {
    if (port.name === 'content-script-connection') {
      // Get the tab ID from the sender
      const tabId = port.sender?.tab?.id;

      if (tabId) {
        console.log(`Content script connected in tab ${tabId}`);

        connectedTabs.add(tabId);

        // Listen for disconnection to remove the tab from our set
        port.onDisconnect.addListener(() => {
          console.log(`Content script disconnected in tab ${tabId}`);
          connectedTabs.delete(tabId);
        });
      }
    }
  });

  /**
   * Listens for when the extension becomes active
   *
   * This handles the case when the extension is disabled and then re-enabled.
   * We need to reinject content scripts into existing tabs.
   */
  browser.management.onEnabled.addListener(async (info: Browser.management.ExtensionInfo) => {
    // Check if it's our extension that was enabled
    if (info.id === browser.runtime.id) {
      console.log('Extension was re-enabled, reinjecting content scripts');

      // Get the current state
      const currentState = await getLocalState();

      try {
        // Find all LinkedIn tabs
        const tabs = await browser.tabs.query({ url: queryTabsUrls });

        console.log(`Found ${tabs.length} LinkedIn tabs that need content script injection after re-enable`);

        // Inject content script into each tab
        for (const tab of tabs) {
          if (tab.id) {
            try {
              // Inject the content script
              await browser.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content-scripts/content.js'],
              });

              console.log(`Successfully injected content script into tab ${tab.id} after re-enable`);

              // Apply the current state with a delay
              setTimeout(async () => {
                // Bypass the connection check since we just injected the script
                await sendToggleMessage(tab.id!, currentState, true);
              }, 250);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              console.error(`Error injecting content script into tab ${tab.id} after re-enable: ${errorMessage}`);
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error handling extension re-enable: ${errorMessage}`);
      }
    }
  });

  /**
   * Listens for messages from content scripts
   *
   * This handles the contentScriptReady message to register tabs.
   */
  browser.runtime.onMessage.addListener(async (message: unknown, sender: Browser.runtime.MessageSender) => {
    if (message && typeof message === 'object' && 'action' in message && message.action === 'contentScriptReady') {
      const tabId = sender.tab?.id;

      if (tabId) {
        console.log(`Content script ready in tab ${tabId}`);
        connectedTabs.add(tabId);

        const state = await getLocalState();

        // Send the current state to the newly ready content script
        await sendToggleMessage(tabId, state);
      }
    }

    return false; // Don't need to send a response
  });

  /**
   * Initializes the extension when it's first installed or updated
   *
   * Sets the default state to XL (full width) and handles content script injection
   * for existing tabs when the extension is updated.
   */
  browser.runtime.onInstalled.addListener(async (details: Browser.runtime.InstalledDetails) => {
    console.log(`LinkedIn Full Width Extension ${details.reason}`);

    const currentState = await getLocalState();

    setState(currentState);

    console.log('Extension installed/updated, injecting content scripts into existing tabs');

    try {
      // Find all LinkedIn tabs
      const tabs = await browser.tabs.query({ url: queryTabsUrls });

      console.log(`Found ${tabs.length} LinkedIn tabs that need content script injection`);

      // Inject content script into each tab
      for (const tab of tabs) {
        if (tab.id) {
          try {
            // Inject the content script
            await browser.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content-scripts/content.js'],
            });

            console.log(`Successfully injected content script into tab ${tab.id}`);

            setTimeout(async () => {
              // Apply the current state to the newly loaded tab
              // Bypass the connection check since we just injected the script
              await sendToggleMessage(tab.id!, currentState, true);
            }, 250);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error injecting content script into tab ${tab.id}: ${errorMessage}`);
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error handling extension update: ${errorMessage}`);
    }
  });

  /**
   * Handles tab update events to apply styles when LinkedIn pages load
   *
   * This listener waits for LinkedIn tabs to finish loading, then applies
   * the current extension state to ensure consistent styling across all tabs.
   */
  browser.tabs.onUpdated.addListener(async (tabId: number, changeInfo: { status?: string }, tab: Browser.tabs.Tab) => {
    // Only process LinkedIn tabs that have finished loading
    if (tab.url?.includes(targetWebsite) && changeInfo.status === 'complete') {
      console.log(`LinkedIn tab updated: ${tab.url}`);

      // Get the current extension state
      const currentState = await getLocalState();

      console.log(`Current state is: ${currentState}`);

      // Add a delay before sending the message to ensure the content script is fully loaded
      // This is crucial for preventing the "Receiving end does not exist" error
      setTimeout(async () => {
        // Apply the current state to the newly loaded tab
        // Bypass the connection check for newly loaded tabs
        await sendToggleMessage(tabId, currentState, true);
      }, 250);
    }
  });

  /**
   * Handles clicks on the extension icon in the browser toolbar
   *
   * When clicked, this toggles between XL (full width) and M (default width) states.
   * It immediately updates the badge and then attempts to update all open LinkedIn tabs.
   */
  browser.action.onClicked.addListener(async () => {
    console.log('Extension icon clicked');

    // Toggle between XL and M states
    const prevState = await getLocalState();
    const nextState = prevState === State.XL ? State.M : State.XL;

    console.log(`Toggling state from ${prevState} to ${nextState}`);

    // Update stored state and badge immediately for instant user feedback
    setState(nextState);

    // Find all open LinkedIn tabs that need to be updated
    const tabs = await browser.tabs.query({ url: queryTabsUrls });

    console.log(`Found ${tabs.length} LinkedIn tabs to update`);

    if (!!tabs.length) {
      // Process all tabs in parallel
      const updatePromises = tabs
        .filter((tab) => tab.id !== undefined)
        .map((tab) => sendToggleMessage(tab.id!, nextState));

      // Wait for all tabs to be updated
      await Promise.all(updatePromises);

      console.log('Finished updating all tabs');
    }
  });
});
