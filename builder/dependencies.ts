import { UI5Symbol } from "./types";
import { forEach, trimEnd, trimStart } from "lodash";
import { NotExistedTypes } from "./not_existed_type";

export const analysisDependencies = (s: UI5Symbol): string[] => {
  const rt = new Set<string>()

  const addToSet = (mName: string = "", set: Set<string>) => {
    mName = trimStart(mName, "module:")
    mName = trimEnd(mName, "[]")
    mName = mName.replace("Promise.", "Promise")
    mName = mName.replace("Array.", "Array")
    mName = mName.replace(/\./g, "/")

    if (mName && mName.startsWith("Promise<") && (!mName.startsWith("Promise|"))) {
      const regResult = /Promise\<(.*?)\>/.exec(mName);
      if (regResult) {
        addToSet(regResult[1], set)
      } else {
        addToSet(mName, rt)
      }
    } else {
      if (mName.indexOf("|") > 0) {
        mName.split("|").forEach(v => addToSet(v, set))
      } else {
        if (mName.startsWith("sap") && !NotExistedTypes.includes(mName.replace(/\//g, "."))) {
          set.add(trimEnd(mName, ">")) // trim unexpected end '<'
        }
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

  var m = s["ui5-metadata"]

  if (m) {

    if (m.properties) {
      forEach(m.properties, p => {
        addToSet(p.type, rt)
      })
    }

    if (m.aggregations) {
      forEach(m.aggregations, a => {
        addToSet(a.type, rt)
      })
    }

    if (m.associations) {
      forEach(m.associations, a => {
        addToSet(a.type, rt)
      })
    }

  }

  if (s.properties) {
    forEach(s.properties, p => {
      addToSet(p.type, rt)
    })
  }

  return Array.from(rt)
}