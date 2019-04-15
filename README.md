# Open UI5 Types

![npm (scoped)](https://img.shields.io/npm/v/@ui5-next/types.svg)

Provide ES6 UI5 types defination. To support vscode `Code IntelliSense`.

![](https://res.cloudinary.com/digf90pwi/image/upload/v1553674217/2019-03-27_16-09-03_mvqoz6.png)

## types

* [x] class
* [x] class method
* [x] class static method
* [ ] class constructor
* [ ] class method parameters type
* [x] class method return type
* [x] enums
* [x] types
* [x] interfaces
* [x] namespace type
* [ ] JSX props support

## to do

* [ ] how to document
* [ ] CI nightly build

## comments

```typescript
// those method return type will be any
// because their parameters are different in parent-class & sub-class
const skipMethods = [
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
]

// those types are not exist in source
// so those types will be replace by 'any'
const NotExistedTypes = [
  "sap.m.IconTabBarSelectList",
  "sap.m.P13nConditionOperation",
  "sap.ui.test.qunit",
  "sap.ui.core.support.Support",
  "appointmentsSorterCallback",
]
```
