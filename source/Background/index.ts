// eslint-disable-next-line import/no-extraneous-dependencies
import * as browser from 'webextension-polyfill';

export enum State {
  XL = 'XL',
  M = 'M',
}

const targetWebsite = 'linkedin.com';
const targetNewModules = ['mypreferences', 'manage'];
const queryTabsUrl = [`https://${targetWebsite}/*`, `https://www.${targetWebsite}/*`];

const css = `
  :root {
    --scaffold-layout-xl-max-width: 100% !important;
    --scaffold-layout-lg-max-width: 100% !important;
    --scaffold-layout-md-max-width: 100% !important;
  }

  #root header div {
    max-width: unset !important;
  }

  #root header > div {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

  .scaffold-layout-container {
    max-width: unset !important;
  }

  .scaffold-layout-container.scaffold-layout-container--reflow {
    width: 100% !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

  .scaffold-layout-container.scaffold-layout-container--reflow > div {
    max-width: unset !important;
  }

  @media screen and (min-width: 1200px) {
    :root {
      --scaffold-layout-sidebar-width: minmax(0, 300px) !important;
      --scaffold-layout-sidebar-narrow-width: minmax(0, 300px) !important;
    }

    .global-nav__content {
      width: 100% !important;
      max-width: none !important;
    }

    .update-components-image__image-link .ivm-image-view-model, .update-components-image__image-link .ivm-view-attr__img-wrapper {
        height: auto !important;
    }

    .scaffold-layout-container.scaffold-layout-container--reflow {
      max-width: none !important;
    }
  }
`;

const applyClassNamesToNewModules = (): void => {
  const elementNewModule = document.querySelector('[tabindex="-1"]');

  if (elementNewModule) {
    elementNewModule.classList.add('scaffold-layout-container');
    elementNewModule.classList.add('scaffold-layout-container--reflow');
  }
};

const executeDefaultStyle = (nextState: 'M' | 'XL'): void => {
  const styleId = 'linkedin-full-width-style';

  if (nextState === 'XL') {
    let style = document.querySelector(`#${styleId}`);

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
    }

    style.innerHTML = css;

    document.head.appendChild(style);
  } else if (nextState === 'M') {
    const style = document.querySelector(`#${styleId}`);

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
  const { state } = await browser.storage.local.get('state');

  return (state as State) ?? State.M;
};

browser.runtime.onInstalled.addListener(() => {
  setState(State.M);
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url?.includes(targetWebsite) && changeInfo.status === 'complete' && tab.active === true) {
    const prevState = await getLocalState();

    browser.scripting.executeScript({
      target: {
        tabId,
      },
      func: executeDefaultStyle,
      args: [prevState],
      world: 'MAIN',
    });

    setState(prevState);
  }
});

browser.webNavigation.onDOMContentLoaded.addListener(async () => {
  const tabs = await browser.tabs.query({ url: queryTabsUrl });

  for (const { id, url } of tabs) {
    const isNotTargetNewModule = targetNewModules.filter((mod) => url?.search(`/${mod}`) !== -1).length === 0;

    if (url?.includes(targetWebsite) && isNotTargetNewModule) {
      browser.scripting.executeScript({
        target: {
          tabId: id!,
        },
        func: applyClassNamesToNewModules,
        world: 'MAIN',
      });
    }
  }
});

browser.action.onClicked.addListener(async (tab) => {
  if (tab.url?.includes(targetWebsite)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await getLocalState();

    // Next state will always be the opposite
    const nextState = prevState === State.XL ? State.M : State.XL;

    const tabs = await browser.tabs.query({ url: queryTabsUrl });

    for (const { id } of tabs) {
      browser.scripting.executeScript({
        target: {
          tabId: id ?? 0,
        },
        func: executeDefaultStyle,
        args: [nextState],
        world: 'MAIN',
      });
    }

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
