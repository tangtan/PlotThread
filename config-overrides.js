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
    modifyVars:{
      "popover-bg": "#34373e",
      "popover-color": "#fff",
      "popover-min-width": "270px",
      "slider-track-background-color": "#6376cc",
      "slider-rail-background-color": "#fff",
      "slider-dot-border-color": "#fff",
      "popover-arrow-width": "8px",
      "slider-handle-border-width": "0px",
      "slider-handle-background-color": "#fff",
      "slider-handle-color": "fff",
      "slider-handle-color-hover": "#fff",
      "slider-margin": "8px 6px 30px 10px",
      "select-dropdown-bg": "#34373e",
      "select-item-selected-bg": "#605a53",
      "select-item-active-bg": "#605a53",
      "select-background": "#25262c",
      "select-dropdown-vertical-padding": "20px",
      "select-dropdown-edge-child-vertical-padding": "10px",
      "input-bg": "#25262c",
      "input-color": "#fff",
      "text-color": "#fff"
    }
  })

);
