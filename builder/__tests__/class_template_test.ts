import { readFileSync } from "fs";
import * as path from "path";
import { UI5APIRef, UI5Symbol, Kind } from '../types';
import { formatClassString } from "../formatter";


describe('class template test group', () => {

  const jsViewSymbolString = readFileSync(
    path.join(__dirname, "./class_js_view.json"),
    { encoding: "UTF-8" }
  )

  const jsViewSymbol: UI5Symbol = JSON.parse(jsViewSymbolString)

  test('should format class symbol', () => {
    expect(formatClassString(jsViewSymbol)).toBeTruthy()
  });

});