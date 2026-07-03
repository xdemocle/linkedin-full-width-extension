import { defineWebExtConfig } from 'wxt';

// This file is git-ignored and configures your local dev browser startup.
// See: https://wxt.dev/guide/essentials/config/browser-startup#persist-data
export default defineWebExtConfig({
  // Persist Chrome profile between dev sessions (login state, devtools extensions, etc.)
  chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
});
