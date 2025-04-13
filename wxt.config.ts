import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/webextension-polyfill', '@wxt-dev/auto-icons'],
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
  manifest: {
    manifest_version: 3,
    name: 'LinkedIn Full Width',
    description: 'Makes LinkedIn pages display in full width mode',
    permissions: ['activeTab', 'scripting', 'storage', 'webNavigation', 'management'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'LinkedIn Full Width',
      // No default_popup property to ensure click handler works
    },
    // web_accessible_resources: [
    //   {
    //     matches: ['<all_urls>'],
    //     resources: ['/icon/*.png', '/content-scripts/*.js'],
    //   },
    // ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
  },
});
