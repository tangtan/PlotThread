// Customize antd theme
const { override, fixBabelImports, addLessLoader } = require("customize-cra");
const darkTheme = require("@ant-design/dark-theme");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "component-background": '#34373e',
      "primary-color": '#6376cc',
      "item-hover-bg": '#605a53',
      "popover-bg": "#34373e",
      "popover-color": "#fff",
      "popover-min-width": "270px",
      "popover-arrow-width": "8px",
      "slider-track-background-color": "#6376cc",
      "slider-rail-background-color": "#fff",
      "slider-dot-border-color": "#fff",
      "slider-handle-border-width": "0px",
      "slider-handle-background-color": "#fff",
      "slider-handle-color": "fff",
      "slider-handle-color-hover": "#fff",
      "slider-margin": "8px 6px 30px 10px",
      "select-item-selected-bg": "#6376cc",
      "select-dropdown-vertical-padding": "20px",
      "select-dropdown-edge-child-vertical-padding": "10px",
      "input-bg": "#25262c",
      "input-color": "#fff",
      "text-color": "#fff",
      "modal-header-bg": "#34373e",
      "modal-heading-color": "#fff",
      "modal-content-bg": "#34373e",
      "modal-footer-bg": "#34373e",
      "modal-mask-bg": "fade(@black, 65%)",
      "tabs-highlight-color": "#fff",
      "tabs-hover-color": "#fff",
      "tabs-active-color": "#fff",
      "tabs-title-font-size": "16px",
      "tabs-horizontal-margin": "0 10px 0 0",
      "tabs-bar-margin": "0 0 6px 0",
      "tabs-title-font-size-lg": "16px",
      "tabs-title-font-size-sm": "16px",
      "tabs-ink-bar-color": "#6376cc"
    }
  })

);
