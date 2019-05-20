
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
  "sap.ui.core.mvc.XMLView.registerPreprocessor",
]