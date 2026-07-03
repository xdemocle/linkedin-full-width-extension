# LinkedIn Full Width Extension - Agent Rules

This document outlines the strict guidelines, constraints, workflows, and conventions that all AI agents collaborating on this project must follow.

---

## 🛠️ Project Stack & Environment

* **Target Browsers:** Google Chrome, Opera, and Mozilla Firefox.
* **Framework:** [@wxt-dev](https://wxt.dev/) extension framework.
* **Manifest Version:** Manifest V3 strictly (**No MV2 patterns allowed**).
* **Language:** TypeScript.
* **UI/UX Strategy:** Pure Vanilla TypeScript & CSS (No frontend frameworks like React, Vue, Svelte).
* **Testing:** Jest with `ts-jest` and `jest-environment-jsdom`.
* **Conventions:** Mixed naming conventions, flat file organization.

---

## 🚫 Boundaries & Strict Rules

### Never:
* **Commit secrets, API keys, or `.env` files.**
* **Modify files listed in `.gitignore`** (including local `web-ext.config.ts` or `.wxt/chrome-data/`).
* **Delete or overwrite test files** without full comprehension of their purpose.
* **Force push** to `main` or `master` branches.
* Make cross-package changes without checking downstream impacts.

### Ask for Explicit Confirmation Before:
* **Modifying or removing user-written code or configurations.**
* **Removing manually added `eslint-disable` comments.**
* **Installing or adding new third-party dependencies** (always propose and compare 3 alternatives first).
* **Changing any project configuration files** (`package.json`, `tsconfig.json`, `wxt.config.ts`, etc.).
* Adding new packages or workspaces.

---

## 🔄 Development & Bug-Fixing Workflow

### 1. Clarification & Design Phase
* **Clarify First:** Always ask clarifying questions about a feature or bug fix *before* writing any code. Proactively check for ambiguities or edge cases.
* **Alternative Solutions:** Always propose 2 (ideally 3) alternative designs. Compare them on performance, UX, and long-term maintainability. **Wait for user approval of the design.**

### 2. Test-Driven Development (TDD)
* **TDD is Mandatory:** Follow TDD strictly. Write a reproducing test *before* implementing a fix or a feature.
* **Communication:** List all planned test cases in the chat. Notify the user as you start implementing each case (no need to pause for approval).
* **Review:** After completing each test case, verify if further test coverage is needed.

### 3. Verification & Hand-off
* **Upgrade Check:** Review the project for deprecated browser/WXT APIs and upgrade usages.
* **Verification:** Re-run the entire test suite (`pnpm test`) to ensure everything works across the app.
* **Hand-off:** Provide a clear overview of the implementation and list manual verification test scenarios.

---

## 📐 Architecture & Code Design

* **Granularization:** Prefer large cohesive files with extensive inline documentation/comments over multiple small files. Favor a flat directory structure.
* **Simplicity:** Prioritize simple solutions with fewer moving parts. Err on the side of fewer components.
* **Code Duplication:** Prioritize slight duplication over premature shallow/generic abstractions.
* **Accessibility (a11y):** Every interactive UI element (like icon-only buttons or custom toolbars) **must have a descriptive text label** (except strictly visual elements like charts).

---

## 💻 Commands Reference

```bash
pnpm dev             # Start dev server (Chrome default)
pnpm dev:chrome      # Start dev server for Chrome
pnpm dev:firefox     # Start dev server for Firefox
pnpm dev:opera       # Start dev server for Opera

pnpm build           # Build production bundles
pnpm build:chrome    # Build for Chrome
pnpm build:firefox   # Build for Firefox
pnpm build:opera     # Build for Opera

pnpm zip             # Create zip files for distribution

pnpm test            # Run all Jest tests
pnpm test:watch      # Run Jest in watch mode
```
