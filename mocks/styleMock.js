// Mock file for CSS imports
export default {
  toString: () => `
    /* Root variables - Override LinkedIn's default max-width constraints */
    :root {
      --scaffold-layout-xl-max-width: 100% !important;
      --scaffold-layout-lg-max-width: 100% !important;
      --scaffold-layout-md-max-width: 100% !important;
      --scaffold-layout-sidebar-narrow-width: minmax(0,300px) !important;
    }

    /* Global navigation - Ensure the nav bar spans the full width */
    .global-nav__content {
      width: 100%;
    }
  `
};
