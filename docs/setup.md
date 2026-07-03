# Setup Guide

This guide describes how to set up your environment, install dependencies, and run the development server for the LinkedIn Full Width extension.

## Prerequisites

Ensure you have the following installed on your machine:

1. **Node.js**: Version 20.x or 22.x (LTS recommended) or higher.
2. **pnpm**: Version 9.x or 11.x (used as the package manager for this project).

## Initial Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/xdemocle/linkedin-full-width-extension.git
   cd linkedin-full-width-extension
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   > [!NOTE]
   > During the installation, pnpm may warn about ignored build scripts (e.g. `unrs-resolver`). If so, run the following command to approve it:
   > ```bash
   > pnpm approve-builds
   > ```

3. **Prepare WXT types**:
   ```bash
   pnpm postinstall
   ```
   This generates the necessary TypeScript declarations (`.wxt/types/`) for autocompletion of browser API polyfills and WXT functions.

---

## Local Development

Start the WXT local dev server, which will compile the extension, open a browser window (Chrome by default), and auto-reload changes:

```bash
pnpm dev
```

### Browser Targeting

You can start the dev server targeting specific browsers:

* **Google Chrome**:
  ```bash
  pnpm dev:chrome
  ```
* **Mozilla Firefox**:
  ```bash
  pnpm dev:firefox
  ```
* **Opera**:
  ```bash
  pnpm dev:opera
  ```

---

## Chrome Developer Profile Persistence

To avoid losing your login state, extension configurations, or custom devtools extensions when you restart `pnpm dev`, a persistent Chrome profile setup is supported.

Create a file named `web-ext.config.ts` in the root directory:
```typescript
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  // Persist the Chrome profile between dev sessions
  chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
});
```
*Note: Both `web-ext.config.ts` and `.wxt/chrome-data/` are git-ignored, so your personal profile data remains local and secure.*

---

## Production Build

To build the extension for deployment:

```bash
pnpm build
```

This creates a production-ready package under the `dist/chrome-mv3` directory.

To build for specific browsers:
* **Chrome**: `pnpm build:chrome`
* **Firefox**: `pnpm build:firefox`
* **Opera**: `pnpm build:opera`

To package the built extension into a ZIP file for upload to extension stores:
```bash
pnpm zip
```
