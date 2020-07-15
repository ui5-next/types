import { UI5Symbol } from "./types";
import { NotExistedTypes } from "./not_existed_type";
import { extractGeneric } from "./formatter";
import { secureSplit } from "./utils";
import { trimPrefix } from "@newdash/newdash/trimPrefix";
import { trimSuffix } from "@newdash/newdash/trimSuffix";
import forEach from "@newdash/newdash/forEach";


export const analysisDependencies = (s: UI5Symbol): string[] => {
  const rt = new Set<string>()

  const addToSet = (mName: string = "", set: Set<string>) => {
    mName = trimPrefix(mName, "module:")
    mName = trimSuffix(mName, "[]")
    mName = mName.replace("module:", "")
    mName = mName.replace("sap.ui.fl.Utils.FakePromise", "Promise")
    mName = mName.replace("Promise.", "Promise")
    mName = mName.replace("Array.", "Array")
    mName = mName.replace("Object.", "Map")
    mName = mName.replace(/[\{\}\(\)]/g, "")

    const generic = extractGeneric(mName)

    if (generic) { // is generic

      const { inner } = generic;

      addToSet(inner, set)

    } else { // is plain ref

      const parts1 = secureSplit(mName, ",")
      const parts2 = secureSplit(mName, "|")
      if (parts1.length > 1) {
        parts1.forEach(c => addToSet(c, set))
      } else if (parts2.length > 1) {
        parts2.forEach(c => addToSet(c, set))
      } else if (mName.startsWith("sap") && !NotExistedTypes.includes(mName.replace(/\//g, "."))) {
        set.add(mName)
      }

    }

  }

  if (s.extends) {
    addToSet(s.extends, rt)
  }

  if (s.methods) {
    forEach(s.methods, m => {
      if (m.returnValue) {
        addToSet(m.returnValue.type, rt)
      }
      if (m.parameters) {
        forEach(m.parameters, parameter => {
          forEach(parameter.types, pType => {
            addToSet(pType.value, rt)
          })
        })
      }
    })
  }

  if (s.events) {
    forEach(s.events, e => {
      if (e.parameters) {
        forEach(e.parameters, p => {
          addToSet(p.type, rt)
        })
      }
    })
  }

  var mName = s["ui5-metadata"]

  if (mName) {

    if (mName.properties) {
      forEach(mName.properties, p => {
        addToSet(p.type, rt)
      })
    }

    if (mName.aggregations) {
      forEach(mName.aggregations, a => {
        addToSet(a.type, rt)
      })
    }

    if (mName.associations) {
      forEach(mName.associations, a => {
        addToSet(a.type, rt)
      })
    }

  }

  if (s.properties) {
    forEach(s.properties, p => {
      addToSet(p.type, rt)
    })
  }

  return Array.from(new Set(Array.from(rt).map(s => s.replace(/\./g, "/").replace(/[\<\>\(\)]/g, ""))))
}