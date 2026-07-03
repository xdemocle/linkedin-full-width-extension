# LinkedIn Full Width Browser Extension

A cross-browser extension that makes LinkedIn pages display in full-width mode.

---

## 📖 Documentation

For detailed information on setup, architecture, and testing, see the dedicated documentation files:

* **[Setup Guide](docs/setup.md)** — Step-by-step developer setup and browser profile persistence.
* **[Architecture Overview](docs/architecture.md)** — Explains the component structure, DOM style injection, and same-origin iframe observation.
* **[Testing & TDD Guide](docs/testing.md)** — Instructions on writing/running Jest unit tests and following TDD.

---

## 🤖 AI Agent Guidelines (`AGENTS.md`)

If you are an AI coding assistant (like Claude, Gemini, Antigravity, or Windsurf) working on this repository, you **MUST** read and follow the instructions in **[AGENTS.md](AGENTS.md)**. 

Key boundaries include:
* **Always** running `pnpm test` before committing.
* **Never** committing secrets or `.env` files.
* **Always** asking for confirmation before deleting user-written code or configurations.

---

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Dev Environment
Starts the dev server, builds the extension, and opens a hot-reloading browser window:
```bash
# Chrome (default)
pnpm dev:chrome

# Firefox
pnpm dev:firefox

# Opera
pnpm dev:opera
```

### 3. Build & Package
```bash
# Compile code
pnpm compile

# Build production bundles (outputs to dist/)
pnpm build

# Zip production bundles for distribution
pnpm zip
```

---

## Loading the Extension Manually

* **Chrome/Opera:** Open `chrome://extensions/` (or `opera://extensions`), enable **Developer mode**, click **Load unpacked**, and select the `dist/chrome-mv3` folder.
* **Firefox:** Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on...**, and select the `dist/firefox-mv3` directory.

---

## License

This project is licensed under the MIT License.
