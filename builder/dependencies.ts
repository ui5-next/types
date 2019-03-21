import { UI5Symbol } from "./types";
import { forEach, trimEnd } from "lodash";

const formatModuleFromNamespace = (s: string): string => {
  // remove end array type
  if (s.endsWith("[]")) {
    s = trimEnd(s, "[]")
  }
  return s.replace(/\./g, "/")
}


export const analysisDependencies = (s: UI5Symbol): string[] => {
  const rt = new Set<string>()
  const moduleName = s.module;

  const addToSet = (mName: string = "", set: Set<string>) => {
    if (mName.startsWith("sap") && mName != moduleName) {
      if (mName.indexOf("|") > 0) {
        mName.split("|").forEach(v => addToSet(v, set))
      } else {
        set.add(formatModuleFromNamespace(mName))
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
  return Array.from(rt)
}