# LinkedIn Full Width Browser Extension

A browser extension that makes LinkedIn pages display in full width mode.

## Features

- Expands LinkedIn's layout to use the full width of your browser window
- Toggle between full width and default LinkedIn layout with a single click
- Automatically applies to all LinkedIn pages
- Works across Chrome, Firefox, and Opera browsers

## Development

This extension is built using the [WXT framework](https://wxt.dev/) for cross-browser compatibility.

### Setup

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server for Chrome
pnpm dev:chrome

# Start development server for Firefox
pnpm dev:firefox

# Start development server for Opera
pnpm dev:opera
```

### Building

```bash
# Build for all browsers
pnpm build

# Build for specific browsers
pnpm build:chrome
pnpm build:firefox
pnpm build:opera
```

### Creating distribution packages

```bash
# Create zip files for all browsers
pnpm zip

# Create zip files for specific browsers
pnpm zip:chrome
pnpm zip:firefox
pnpm zip:opera
```

## Loading the extension in browsers

### Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/chrome` directory

### Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the `dist/firefox` directory or the generated `.zip` file

### Opera

1. Go to `opera://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/opera` directory

## License

MIT
