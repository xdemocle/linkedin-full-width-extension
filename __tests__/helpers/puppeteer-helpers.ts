// @ts-ignore - Puppeteer types will be installed when needed
import * as puppeteer from 'puppeteer';
import * as path from 'path';

/**
 * Gets the extension ID for the loaded extension
 * 
 * @param browser - Puppeteer browser instance
 * @returns Promise resolving to the extension ID
 */
export async function getExtensionId(browser: puppeteer.Browser): Promise<string> {
  const targets = await browser.targets();
  const extensionTarget = targets.find((target: any) => 
    target.type() === 'background_page' && target.url().includes('linkedin-full-width')
  );
  
  if (!extensionTarget) {
    throw new Error('Could not find LinkedIn Full Width extension background page');
  }
  
  const extensionUrl = extensionTarget.url();
  const [, , extensionId] = extensionUrl.split('/');
  return extensionId;
}

/**
 * Launches a browser with the LinkedIn Full Width extension loaded
 * 
 * @param pathToExtension - Path to the extension directory
 * @returns Promise resolving to the browser instance
 */
export async function launchBrowserWithExtension(pathToExtension: string): Promise<puppeteer.Browser> {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-sandbox'
    ],
    defaultViewport: null
  });
  
  return browser;
}

/**
 * Clicks the extension button in the browser toolbar
 * 
 * @param browser - Puppeteer browser instance
 * @param extensionId - ID of the extension
 * @returns Promise resolving when the button is clicked
 */
export async function clickExtensionButton(browser: puppeteer.Browser, extensionId: string): Promise<void> {
  // This is a bit tricky as Puppeteer doesn't have direct access to browser UI
  // We can use the chrome.action.onClicked event instead
  const backgroundPage = await getBackgroundPage(browser, extensionId);
  await backgroundPage.evaluate(() => {
    // Simulate a click on the extension icon
    // @ts-ignore - chrome is available in the extension context
    chrome.action.onClicked.dispatch({});
  });
}

/**
 * Gets the background page for the extension
 * 
 * @param browser - Puppeteer browser instance
 * @param extensionId - ID of the extension
 * @returns Promise resolving to the background page
 */
export async function getBackgroundPage(browser: puppeteer.Browser, extensionId: string): Promise<puppeteer.Page> {
  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    (target: any) => target.type() === 'background_page' && target.url().includes(extensionId)
  );
  
  if (!backgroundPageTarget) {
    throw new Error('Could not find extension background page');
  }
  
  const page = await backgroundPageTarget.page();
  if (!page) {
    throw new Error('Could not get background page');
  }
  
  return page;
}

/**
 * Waits for the content script to be injected and initialized
 * 
 * @param page - Puppeteer page instance
 * @returns Promise resolving when the content script is ready
 */
export async function waitForContentScript(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(() => {
    return document.getElementById('linkedin-full-width-style') !== null;
  }, { timeout: 5000 });
}
