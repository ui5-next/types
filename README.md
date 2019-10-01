# Open UI5 Types

[![CircleCI](https://circleci.com/gh/ui5-next/types.svg?style=shield)](https://circleci.com/gh/ui5-next/types)
[![npm (scoped)](https://img.shields.io/npm/v/@ui5-next/types.svg)](https://www.npmjs.com/package/@ui5-next/types)

Provide ES6 UI5 types definition. To support vscode `Code IntelliSense`.

![](https://res.cloudinary.com/digf90pwi/image/upload/v1553674217/2019-03-27_16-09-03_mvqoz6.png)

## types

* [x] class
* [x] class method
* [x] class static method
* [x] class constructor
* [x] class method parameters type
* [x] class method return type
* [x] enums
* [x] types
* [x] interfaces
* [x] namespace type
* [x] JSX props support

## to do

* [ ] how to document
* [ ] CI nightly build

## comments

```typescript
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

// those types are not exist in source
// so those types will be replace by 'any'
export const NotExistedTypes = [
  "sap.m.IconTabBarSelectList",
  "sap.m.P13nConditionOperation",
  "sap.ui.test.qunit",
  "sap.ui.core.support.Support",
  "appointmentsSorterCallback",
  "sap.m.TextField",
  "sap.m.P13nConditionOperation",
  "DomRef",
  "sap.ui.fl.Change",
  "sap.ui.integration.CardActionType",
  "sap.ui.commons.form.SimpleFormLayout",
]
```
