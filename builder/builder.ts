
import { UI5APIRef, Kind, Stereotype } from './types';
import { writeFileSync } from "fs";
import * as path from "path";
import { formatClassString, formatEnumString, formatTypeString, formatNsType, formatInterfaceString, formatNsClassString, formatPureNsNode, formatFunctionString } from './formatter';
import * as fetch from "node-fetch";
import { Ui5DistVersion, Library } from './ui5_dist_types';

const replaceLinkBase = (content = "", newBase = "") => {
  return content.replace(/https:\/\/openui5\.hana\.ondemand\.com\//g, newBase)
}

export const buildTypeDefinitions = (ref: UI5APIRef) => {

  console.log(`Building type definition for ${ref.library}`)

  var typeString = ""

  typeString += `// UI5 Version: ${ref.version}\n`

  typeString += `// Date: ${new Date().toISOString()}\n`

  typeString += `// Library: ${ref.library}\n`

  typeString += `/// <reference path="./base.d.ts" />`

  ref.symbols.forEach(s => {
    switch (s.kind) {
      case Kind.Class:
        typeString += formatClassString(s)
        break;
      case Kind.Enum:
        typeString += formatEnumString(s)
        break;
      case Kind.Typedef:
        typeString += formatTypeString(s)
        break;
      case Kind.Namespace:
        // need to combine different ns type here
        if (s["ui5-metadata"] && s["ui5-metadata"].stereotype == Stereotype.Datatype) {
          typeString += formatNsType(s)
        } else if (s.basename && s.export && s.visibility == "public" && s.basename == s.export) {
          typeString += formatEnumString(s)
        } else if (s.methods) {
          typeString += formatNsClassString(s);
        } else {
          // name space or empty
          typeString += formatPureNsNode(s);
        }
        break;
      case Kind.Interface:
        typeString += formatInterfaceString(s)
        break;
      case Kind.Function:
        typeString += formatFunctionString(s)
        break;
      default:
        break;
    }
  })

  typeString = replaceLinkBase(typeString, `https://openui5.hana.ondemand.com/${ref.version}/`)

  writeFileSync(path.join(__dirname, `../bin/${ref.library}.d.ts`), typeString, { encoding: "UTF-8" })
}

const JSXDeclaration = `
declare namespace JSX {
  interface ElementAttributesProperty {
    props: any; // specify the property name to use
  }
}
`

export const writeIndexDTS = (libs: string[]) => {
  writeFileSync(path.join(__dirname, "../bin/index.d.ts"), (libs.map(l => `import "./${l}"`).join("\n") + JSXDeclaration), { encoding: "UTF-8" })
}

const ui5_host = "openui5.hana.ondemand.com"

const formatApiRefURL = (lib: Library) => `https://${ui5_host}/test-resources/${lib.name.replace(/\./g, "/")}/designtime/apiref/api.json`

// MAIN process
if (require.main === module) {

  fetch(`https://${ui5_host}/resources/sap-ui-version.json`)
    .then(res => res.json())
    .then((version: Ui5DistVersion) => {
      const libraries = version.libraries.filter(l => !l.name.startsWith("themelib") && l.name != "sap.ui.server.java")
      console.log(`Building ui5 type definition with version: ${version.version}`)

      return Promise
        .all(libraries
          .map(formatApiRefURL)
          .map(url => fetch(url).then(res => res.json()).then(buildTypeDefinitions).catch(console.error)))
        .then(() => {
          writeIndexDTS(libraries.map(library => library.name))
        })


    })

}

