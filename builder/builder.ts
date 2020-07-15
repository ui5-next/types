
import { UI5APIRef, Kind, Stereotype } from './types';
import { writeFileSync } from "fs";
import * as path from "path";
import { formatClassString, formatEnumString, formatTypeString, formatNsType, formatInterfaceString, formatNsClassString, formatPureNsNode, formatFunctionString } from './formatter';
import * as fetch from "node-fetch";
import { Ui5DistVersion, Library } from './ui5_dist_types';

const replaceLinkBase = (content = "", newBase = "") => {
  return content
    .replace(/https:\/\/openui5\.hana\.ondemand\.com\//g, newBase)
    .replace(/\.\/resources\//g, `https://openui5.hana.ondemand.com/resources/`)  // replace relative reference
    .replace(/\(\#\/api\/(.*?)\)/g, "(https://openui5.hana.ondemand.com/#/api/$1)")

}

const checkResourceExist = async (url) => {
  const response = await fetch(url, { method: "HEAD" })
  return response.status == 200
}

const getMainVersion = (s = "") => {
  let parts = s.split(".")
  parts.pop()
  parts.push("0")
  return parts.join(".")
}

const getDocumentBase = async (version = "") => {
  // default to current version
  let rt = `https://openui5.hana.ondemand.com/${version}/`
  let versionDocExist = await checkResourceExist(`${rt}index.html`)
  if (versionDocExist) {
    return rt
  }
  // fallback to main version
  rt = `https://openui5.hana.ondemand.com/${await getMainVersion(version)}/`
  versionDocExist = await checkResourceExist(`${rt}index.html`)
  if (versionDocExist) {
    return rt
  }

  // fallback
  return "https://openui5.hana.ondemand.com/"

}

export const buildTypeDefinitions = (docLinkBase = "https://openui5.hana.ondemand.com/") => (defineResourceUrl = "") => (ref: UI5APIRef) => {

  console.log(`Building type definition for ${ref.library}`)

  var typeString = ""

  typeString += '// @ts-nocheck\n'

  typeString += `// UI5 Version: ${ref.version}\n`

  typeString += `// Date: ${new Date().toISOString()}\n`

  typeString += `// Library: ${ref.library}\n`

  typeString += `// Link: ${defineResourceUrl}\n`

  typeString += `/// <reference path="./base.d.ts" />\n`

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
          if (s.name != "sap") {
            if (s.name == "sap.ui") {
              if (ref.library == "sap.ui.core") {
                typeString += formatNsClassString(s);
              }
            } else {
              typeString += formatNsClassString(s);
            }
          }
        } else {
          if (s.name != "sap") {
            if (s.name == "sap.ui") {
              if (ref.library == "sap.ui.core") {
                typeString += formatPureNsNode(s);
              }
            } else {
              typeString += formatPureNsNode(s);
            }
          }
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

  typeString = replaceLinkBase(typeString, docLinkBase)

  writeFileSync(path.join(__dirname, `../bin/${ref.library}.d.ts`), typeString, { encoding: "utf8" })

}

const JSXDeclaration = `
declare namespace JSX {
  interface ElementAttributesProperty {
    props: any; // specify the property name to use
  }
}
`

export const writeIndexDTS = (libs: string[]) => {
  writeFileSync(path.join(__dirname, "../bin/index.d.ts"), (libs.map(l => `import "./${l}"`).join("\n") + JSXDeclaration), { encoding: "utf8" })
}

const formatApiRefURL = (base = "https://openui5.hana.ondemand.com/") => (lib: Library) => `${base}test-resources/${lib.name.replace(/\./g, "/")}/designtime/apiref/api.json`

// MAIN process
if (require.main === module) {

  (
    async () => {
      const response = await fetch(`https://openui5.hana.ondemand.com/resources/sap-ui-version.json`);
      const version: Ui5DistVersion = await response.json()
      const libraries = version.libraries.filter(l => !l.name.startsWith("themelib") && l.name != "sap.ui.server.java")
      console.log(`Building ui5 type definition with version: ${version.version}`)

      const documentBase = await getDocumentBase(version.version)

      const dtsBuilder = buildTypeDefinitions(documentBase)

      await Promise
        .all(
          libraries.map(formatApiRefURL(documentBase)).map(
            url => fetch(url)
              .then(res => res.json())
              .then(dtsBuilder(url))
              .catch(console.error)
          )
        )

      writeIndexDTS(libraries.map(library => library.name))

    }
  )()

}

