// import { browser } from 'webextension-polyfill-ts';

// interface NavigationDetails {
//   tabId: number;
//   url: string;
//   frameType?: string;
// }

// enum State {
//   ON = 'ON',
//   OFF = 'OFF',
// }

// const targetWebsite = 'https://www.linkedin.com';

// const applyStyle = (): void => {
//   const width = '100';
//   const style = document.createElement('style');

//   style.id = 'linkedin-full-width-style';

//   style.innerHTML = `
//     .global-nav__content {
//         width: ${width}% !important;
//         max-width: none !important;
//         padding-left: 2rem !important;
//         padding-right: 2rem !important;
//     }

//     :root {
//         --scaffold-layout-xl-max-width: ${width}% !important;
//         --scaffold-layout-sidebar-width: minmax(0, 300px) !important;
//         --scaffold-layout-sidebar-narrow-width: minmax(0, 300px) !important;
//     }

//     .update-components-image__image {
//         width: 80%;
//         height: 100%;
//         margin: 0 auto;
//     }

//     .update-components-image__container {
//       padding-top: 103% !important;
//     }

//     .update-components-image__image-link .ivm-image-view-model, .update-components-image__image-link .ivm-view-attr__img-wrapper {
//         height: auto !important;
//     }

//     @media screen and (min-width: 1200px) {
//         .scaffold-layout-container.scaffold-layout-container--reflow {
//             max-width: none !important;
//         }
//     }

//     @media screen and (min-width: 992px) {
//         .scaffold-layout-container.scaffold-layout-container--reflow {

//         padding-left: 2rem !important;
//         padding-right: 2rem !important;
//         }
//         .scaffold-layout--reflow .scaffold-layout__content--list-detail-aside {
//             grid-template-columns: minmax(0, 20fr) minmax(300px, 4fr) !important;
//         }
//     }
//   `;

//   document.head.appendChild(style);

//   browser.action.setBadgeText({
//     text: State.ON,
//   });
// };

// const removeStyle = (): void => {
//   const style = document.querySelector('#linkedin-full-width-style');

//   if (style) {
//     document.head.removeChild(style);
//   }

//   browser.action.setBadgeText({
//     text: State.OFF,
//   });
// };

// const executeDefaultStyle = async (nextState: string): Promise<void> => {
//   if (window.location.href.startsWith(targetWebsite)) {
//     if (nextState === 'ON') {
//       applyStyle();
//     } else if (nextState === 'OFF') {
//       removeStyle();
//     }

//     browser.storage.local.set({
//       state: nextState,
//     });
//   }
// };

// const bootstrap = async (): Promise<void> => {
//   const prevState = await browser.storage.local.get('state');

//   executeDefaultStyle(prevState.state ?? State.OFF);
// };

// bootstrap();

// browser.runtime.onInstalled.addListener(
//   async (details: Runtime.OnInstalledDetailsType): Promise<void> => {
//     console.log('🦄', details.reason);
//     if (['update', 'install'].includes(details.reason)) {
//       const prevState = await browser.storage.local.get('state');

//       executeDefaultStyle(prevState.state ?? State.OFF);
//     }
//   }
// );

// browser.action.onClicked.addListener(async (tab) => {
//   if (tab.url?.startsWith(targetWebsite)) {
//     // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//     const prevState = await browser.storage.local.get('state');

//     // Next state will always be the opposite
//     const nextState = String(prevState.state) === 'ON' ? 'OFF' : 'ON';

//     executeDefaultStyle(nextState);
//   }
// });

export {};
