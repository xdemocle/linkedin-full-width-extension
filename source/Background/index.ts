// eslint-disable-next-line import/no-extraneous-dependencies
import * as browser from 'webextension-polyfill';
import { State } from '../types';

const targetWebsite = 'linkedin.com';
const width = '100';
const css = `
  .global-nav__content {
      width: ${width}% !important;
      max-width: none !important;
      padding-left: 2rem !important;
      padding-right: 2rem !important;
  }

  :root {
      --scaffold-layout-xl-max-width: ${width}% !important;
      --scaffold-layout-sidebar-width: minmax(0, 300px) !important;
      --scaffold-layout-sidebar-narrow-width: minmax(0, 300px) !important;
  }

  .update-components-image__image {
      width: 80%;
      height: 100%;
      margin: 0 auto;
  }

  .update-components-image__container {
    padding-top: 103% !important;
  }


  .update-components-image__image-link .ivm-image-view-model, .update-components-image__image-link .ivm-view-attr__img-wrapper {
      height: auto !important;
  }

  @media screen and (min-width: 1200px) {
      .scaffold-layout-container.scaffold-layout-container--reflow {
          max-width: none !important;
      }
  }

  @media screen and (min-width: 992px) {
      .scaffold-layout-container.scaffold-layout-container--reflow {
          
      padding-left: 2rem !important;
      padding-right: 2rem !important;
      }
      .scaffold-layout--reflow .scaffold-layout__content--list-detail-aside {
          grid-template-columns: minmax(0, 20fr) minmax(300px, 4fr) !important;
      }
  }
`;

const executeDefaultStyle = (nextState: State): void => {
  if (nextState === State.ON) {
    const style = document.createElement('style');

    style.id = 'linkedin-full-width-style';
    style.innerHTML = css;

    document.head.appendChild(style);
  } else if (nextState === State.OFF) {
    const style = document.querySelector('#linkedin-full-width-style');

    if (style) {
      document.head.removeChild(style);
    }
  }
};

const setState = (nextState: State): void => {
  browser.action.setBadgeText({
    text: nextState,
  });

  browser.storage.local.set({
    state: nextState,
  });
};

const getLocalState = async (): Promise<State> => {
  return ((await browser.storage.local.get('state')).state as State) ?? State.OFF;
};

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url?.includes(targetWebsite) && changeInfo.status === 'complete' && tab.active === true) {
    const prevState = await getLocalState();

    browser.scripting.executeScript({
      target: {
        tabId,
      },
      func: executeDefaultStyle,
      args: [prevState],
    });

    setState(prevState);
  }
});

browser.action.onClicked.addListener(async (tab) => {
  if (tab.url?.includes(targetWebsite)) {
    // console.log('onClicked', tab);

    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await getLocalState();

    // Next state will always be the opposite
    const nextState = prevState === State.ON ? State.OFF : State.ON;

    browser.scripting.executeScript({
      target: {
        tabId: tab.id ?? 0,
      },
      func: executeDefaultStyle,
      args: [nextState],
    });

    setState(nextState);
  }
});

// browser.runtime.onInstalled.addListener(
//   async (details: Runtime.OnInstalledDetailsType): Promise<void> => {
//     if (['update', 'install'].includes(details.reason)) {
//       console.log('🦄', details.reason);
//       const prevState = await browser.storage.local.get('state');

//       browser.scripting.executeScript({
//         target: {
//           tabId: tab.id!,
//         },
//         func: executeDefaultStyle,
//         args: [prevState.state ?? State.OFF],
//       });
//     }
//   }
// );

// browser.tabs.onCreated.addListener((tab) => {
//   console.log('tab', tab);
// });
