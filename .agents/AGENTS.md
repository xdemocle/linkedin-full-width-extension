# LinkedIn Full Width Extension - Agent Rules

This file outlines the development specifications, guidelines, and workflows for agents collaborating on this project.

## Main Specifications

* **Target Browsers:** Cross-browser extension supporting Chrome, Opera, and Firefox.
* **Framework:** Powered by [@wxt-dev](https://wxt.dev/) extension framework.
* **Manifest Version:** Manifest V3 strictly. **Do not use manifest v2 code patterns.**
* **Language:** TypeScript.
* **Bundler:** Webpack.
* **UI/UX Strategy:** Pure Vanilla TypeScript/CSS. No client frameworks (like React, Vue, Svelte) are used.
* **Git Safety:** Never modify any files listed in `.gitignore`.

## Confirmation Rules

* **Preservation:** Always ask for explicit confirmation before removing or modifying any code or configurations manually added by the user.
* **ESLint:** Before removing manually added `eslint-disable` comments, always ask for confirmation.

## Development Workflow

### 1. Clarification First
* Always ask clarifying questions about a feature or bug fix before writing code.
* Verify if there is any ambiguity or poorly thought-out areas, and ensure they are addressed.
* If the user says "No more questions", stop the clarification phase and proceed to implementation.

### 2. TDD (Test-Driven Development)
* Follow TDD strictly.
* Before implementing a change, list all test cases that will be written.
* Notify the user whenever starting implementation of a new test case (no need to pause for approval).
* After completing each testcase, review if more test cases are needed and notify the user of any additions.

### 3. Verification & Hand-off
* Review the project for deprecated features/APIs after changes and upgrade usages accordingly.
* Re-run the entire test suite (`pnpm test`) to ensure everything is functioning across the app.
* Provide a clear overview of the implementation and a list of manual test scenarios for the user.

## Bug Fixing Guidelines

* When an issue is reported, ask for clarification if steps to reproduce or circumstances are unclear.
* Outline the proposed fix with clear hypotheses explaining why it will work.
* Specify which files will be modified and how.
* Highlight relevant code snippets in the chat and wait for confirmation before making modifications.
* Always write a test to reproduce/verify the bug/correct behavior *before* implementing the fix.

## UI Structure

* Every UI element (e.g. icon-only buttons, custom toolbars) **must have a descriptive text label** for accessibility (except for strictly visual components like charts).

## Architecture & Code Design

* **Simplicity:** Favor simple solutions with fewer moving parts.
* **Cohesion:** Prefer keeping code cohesive over extracting premature abstractions.
* **Alternative Solutions:** Always propose 2 (ideally 3) alternative solutions and compare them for performance, UX, and long-term maintainability before coding. Wait for user confirmation on the chosen approach.
* **Component Granularization:** Start with fewer components and extract them later once dependency requirements are mature.
* **Code Duplication:** Err on the side of slight duplication over premature shallow/generic abstractions.
* **File Structure:**
  * Prefer large files with extensive inline documentation/comments over multiple small files.
  * Favor flat file organization over deep nested folders.

## Third-Party Dependencies

* When selecting new third-party libraries:
  * Select up to 3 alternatives and compare them.
  * Prioritize options that are well-documented and widely used.
  * Obtain user approval before installing/using the package.
