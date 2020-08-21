import { analysisDependencies } from "../dependencies";
import * as jsViewSymbol from "./class_js_view.json";

describe('dependencies analysis test suite', () => {

  test('should analysis deps for JSView', () => {
    const ep = Array.from(
      [
        'sap/ui/core/mvc/View',
        'sap/ui/core/mvc/Controller',
        'sap/ui/core/Control',
        'sap/ui/base/Metadata'
      ]
    );
    expect(analysisDependencies(<any>jsViewSymbol)).toEqual(ep);
  });

});