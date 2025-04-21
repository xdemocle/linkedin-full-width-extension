/**
 * LinkedIn Full Width Extension - Injected Script
 *
 * This script runs in the page context and has full access to the page's JavaScript environment.
 * It communicates with the content script using window.postMessage.
 */

// Listen for messages from the content script
window.addEventListener('message', (event) => {
  // Validate the origin - only accept messages from the same window
  if (event.source !== window) {
    return;
  }

  const message = event.data;

  // Check if this is a message from our extension
  if (message && message.source === 'linkedin-full-width-content') {
    console.log('Injected script received message:', message);

    // Handle style toggle messages
    if (message.action === 'toggleStyles') {
      // Here we could perform any page-context operations needed
      // For now, just echo back to confirm receipt
      window.postMessage(
        {
          source: 'linkedin-full-width-injected',
          action: 'toggleStylesConfirm',
          state: message.state,
        },
        '*'
      );
    }
  }
});

// Notify the content script that the injected script is ready
window.postMessage(
  {
    source: 'linkedin-full-width-injected',
    action: 'injectedScriptReady',
  },
  '*'
);

// Keep a heartbeat to ensure the content script knows we're still active
setInterval(() => {
  window.postMessage(
    {
      source: 'linkedin-full-width-injected',
      action: 'heartbeat',
      timestamp: Date.now(),
    },
    '*'
  );
}, 30000); // Send heartbeat every 30 seconds
