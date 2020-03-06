import { formatModuleName, extractGeneric } from "../formatter";

const moduleParsingFixtures = [
  {
    s: "sap.ui.fl.Utils.FakePromise<(sap.ui.core.Element|false)>",
    e: "Promise<ImportedSapUiCoreElement | false>"
  },
  {
    s: "Promise|sap.ui.fl.Utils.FakePromise<(sap.ui.core.Element|false)>",
    e: "Promise<any> | Promise<ImportedSapUiCoreElement | false>"
  },
  {
    s: "Array.<Object.<string,any>>",
    e: "Array<Map<string, any>>"
  },
  {
    s: "Object.<string,any>",
    e: "Map<string, any>"
  },
  {
    s: "module:sap/base/i18n/ResourceBundle",
    e: "ImportedSapBaseI18nResourceBundle"
  },
  {
    s: "module:sap/base/i18n/ResourceBundle|Promise.<module:sap/base/i18n/ResourceBundle>",
    e: "ImportedSapBaseI18nResourceBundle | Promise<ImportedSapBaseI18nResourceBundle>"
  },
  {
    s: "Array.<{type:string,index:int}>",
    e: "Array<{type:string,index:number}>"
  },
]

describe('format module name test suite', () => {

  it('should fix return types', () => {

    moduleParsingFixtures.forEach(({ s, e }) => {
      expect(formatModuleName(s)).toBe(e)
    })


  });

  it('should check generic type', () => {

    expect(extractGeneric("Promise<boolean>")).toStrictEqual({ generic: "Promise", inner: "boolean" })
    expect(extractGeneric("Array<string>")).toStrictEqual({ generic: "Array", inner: "string" })
    expect(extractGeneric("Promise<(sap.ui.core.Element|false)>")).toStrictEqual({ generic: "Promise", inner: "sap.ui.core.Element|false" })

    expect(extractGeneric("Array")).toBeNull()
    expect(extractGeneric("module:sap/base/i18n/ResourceBundle|Promise.<module:sap/base/i18n/ResourceBundle>")).toBeNull()

  });

})


