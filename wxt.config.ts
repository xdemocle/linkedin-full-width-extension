import { defineConfig } from 'wxt';
import { targetWebsite, extensionName, extensionDescription } from './web-extension-config';

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
    name: extensionName,
    description: extensionDescription,
    permissions: ['activeTab', 'scripting', 'storage', 'webNavigation', 'management'],
    host_permissions: [`${targetWebsite}/*`],
    action: {
      default_title: extensionName,
      // No default_popup property to ensure click handler works
    },
    web_accessible_resources: [
      {
        resources: ['/inject-script.js'],
        matches: [`${targetWebsite}/*`]
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
  },
});
