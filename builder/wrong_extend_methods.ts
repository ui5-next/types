
// following methods return type & parameters will be `any`
// because there parameters are different in parent-class & sub-class
export const skipMethods = [
  "sap.ui.base.Object.defineClass",
  "parseValue",
  "setVisible",
  "getDomRef",
  "getControlMessages",
  "clone",
  "setDatetime",
  "getTooltip",
  "setValue",
  "getSelectedIndex",
  "getValue",
  "setAuthorPicture",
  "setPriority",
  "addSelectionInterval",
  "publish",
  "subscribe",
  "validateValue",
  "refresh",
  "filter",
  "sort",
  "bindContext",
  "bindList",
  "fireChange",
  "setSelectedIndex",
  "setSelectionInterval",
  "setEnableGrouping",
  "getContextByIndex",
  "setGroupBy",
  "selectAll",
  "removeSelectionInterval",
  "sap.ui.core.mvc.XMLView.registerPreprocessor",
]