# Testing Guide

This guide explains the testing architecture, environment setup, and instructions for running and writing tests in the LinkedIn Full Width extension.

## Test Stack

* **Runner:** [Jest](https://jestjs.io/) configured for ES modules.
* **Environment:** `jest-environment-jsdom` for simulating browser environment APIs.
* **Compiler:** `ts-jest` for executing TypeScript tests directly.

---

## Test Organization

Tests are organized inside the [`__tests__`](file:///Users/democle/Documents/linkedin-full-width-extension/__tests__) directory:

```
__tests__/
  ├── setup.ts            # Global Jest test setup and mocks
  ├── helpers/            # Helper files for tests
  ├── background/         # Tests targetting entrypoints/background.ts
  └── content/            # Tests targetting entrypoints/content/index.ts
```

---

## Global Setup & Mocks

Since tests run in Node.js (via JSDOM), we mock Chrome/WebExtension APIs to simulate browser extension behaviors.

### [setup.ts](file:///Users/democle/Documents/linkedin-full-width-extension/__tests__/setup.ts)
This script is loaded by Jest before executing any test suite. It:
1. Replaces the global `browser` and `chrome` namespaces with simulated spy/mock implementations (e.g. `browser.storage.local.get`, `browser.scripting.executeScript`, etc.).
2. Polyfills DOM head/body elements in JSDOM environments if not already present.

To inspect or verify mock behavior in a test file, you can access the global `browser` object and assert its function calls:
```typescript
expect(browser.storage.local.set).toHaveBeenCalledWith({ state: 'XL' });
```

---

## Running Tests

Run the following scripts from the project root:

### Run all tests once
```bash
pnpm test
```

### Run tests in watch mode (interactive development)
```bash
pnpm test:watch
```

---

## Test-Driven Development (TDD) Guidelines

Per the project's agent rules, follow these guidelines when introducing features or resolving bugs:

1. **Write the test case first:** Create a test case reproducing the bug or defining the new feature *before* you change the code.
2. **List test cases:** Document the list of test cases in your plan or in the chat before implementing them.
3. **Execute and watch:** Use `pnpm test:watch` to see the test fail initially, and then pass as you implement the solution.
4. **Full Verification:** Always re-run the full suite (`pnpm test`) before finalizing any feature to check for regressions.
