
import { UI5APIRef, Kind } from './types';
import { writeFileSync } from "fs";
import * as path from "path";
import { formatClassString } from './formatter';

export const buildTypeDefination = (ref: UI5APIRef) => {
  var typeString = "";

  ref.symbols.forEach(s => {
    if (s.kind == Kind.Class) {
      typeString += formatClassString(s)
    }
  })

  writeFileSync(path.join(__dirname, "../bin/index.d.ts"), typeString, { encoding: "UTF-8" })

}