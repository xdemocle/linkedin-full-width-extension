import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/webextension-polyfill', '@wxt-dev/auto-icons'],
  outDir: 'dist',
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
  manifest: {
    name: 'LinkedIn Full Width',
    description: 'Makes LinkedIn pages display in full width mode',
    permissions: ['activeTab', 'scripting', 'storage', 'webNavigation', 'management'],
    host_permissions: ['https://www.linkedin.com/*'],
    // No default_popup property to ensure click handler works
    action: {
      default_title: 'LinkedIn Full Width',
    },
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
  },
});
