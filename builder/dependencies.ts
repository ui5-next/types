import { UI5Symbol } from "./types";
import { forEach, trimEnd, trimStart } from "lodash";

const formatModuleFromNamespace = (s: string): string => {
  // remove end array type
  if (s.endsWith("[]")) {
    s = trimEnd(s, "[]")
  }
  return s.replace(/\./g, "/")
}


export const analysisDependencies = (s: UI5Symbol): string[] => {
  const rt = new Set<string>()

  const addToSet = (mName: string = "", set: Set<string>) => {
    mName = trimStart(mName, "module:")
    if (mName.startsWith("sap")) {
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
        const rtType = m.returnValue.type
        if (rtType && rtType.startsWith("Promise") && (!rtType.startsWith("Promise|")) && rtType.indexOf("|") > 0) {
          const regResult = /Promise\.?\<(.*?)\>/.exec(rtType);
          if (regResult) {
            const inner = regResult[1]
            inner.split("|").forEach(i => addToSet(i, rt))
          } else {
            addToSet(rtType, rt)
          }
        } else {
          addToSet(rtType, rt)
        }
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