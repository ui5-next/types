
import { UI5APIRef, Kind } from './types';
import { writeFileSync } from "fs";
import * as path from "path";
import { formatClassString } from './formatter';
import * as fetch from "node-fetch";

export const buildTypeDefination = (ref: UI5APIRef) => {
  var typeString = `
// UI5 Version: ${ref.version} 
// Date: ${new Date().toISOString()}

// failback module
declare module 'sap/*' {
  export default undefined
}

`

  ref.symbols.forEach(s => {
    if (s.kind == Kind.Class) {
      typeString += formatClassString(s)
    }
  })

  writeFileSync(path.join(__dirname, "../bin/index.d.ts"), typeString, { encoding: "UTF-8" })
}



// MAIN process
if (require.main === module) {
  fetch(`https://openui5.hana.ondemand.com/test-resources/sap/ui/core/designtime/apiref/api.json`)
    .then(res => res.json())
    .then(buildTypeDefination)
    .catch(console.error)
}

