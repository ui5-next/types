
import { UI5Symbol, Kind, Method } from './types';
import { readFileSync } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as TurnDownService from "turndown";
import { analysisDependencies } from './dependencies';
import { upperFirst, trimStart } from "lodash";

const turnDownService = new TurnDownService()

const loadTemplate = (p: string) => Handlebars.compile(
    readFileSync(path.join(__dirname, p), { encoding: "UTF-8" })
)

/**
 * templates
 */
const templates = {
    classTempalete: loadTemplate("./templates/class.ts.template"),
}

Handlebars.registerHelper("formatNameSpaceToModule", (m: string) => {
    return m.replace(/\./g, "/")
})

Handlebars.registerHelper("extractImportClassName", (m: string) => {
    return `Imported${m.split("/").pop()}`
})

Handlebars.registerHelper("formatBaseName", (base: string) => {
    if (base.startsWith("module:")) {
        return base.split("/").pop()
    } else {
        return base
    }
})


Handlebars.registerHelper("formatDefault", (m: string, cName: string) => {
    const moduleName = m.split("/").pop()
    if (moduleName.toLowerCase() == moduleName) {
        return ""
    } else {
        if (moduleName == cName) {
            return "default "
        } else {
            return ""
        }

    }
})

Handlebars.registerHelper("formatDescription", (d: string) => {
    try {
        return turnDownService.turndown(d)
    } catch (error) {
        return d
    }
})

const formatModuleName = (m: string) => {
    m = trimStart(m, "module:")
    if (m.startsWith("sap")) {
        return `Imported${m.split(/\.|\//g).map(upperFirst).join("")}`
    } else {
        switch (m) {
            case "int":
                return "number"
            case "bject[]":
                return "object[]"
            case "bject":
                return "object"
            case "Promise":
                return "Promise<any>"
            case "ndefined":
                return "undefined";
            case "function":
                return "Function"
            case "array":
                return "Array<any>"
            case "ap":
                return "any"
            case "Array":
                return "Array<any>"
            default:
                return m
        }
    }
}

Handlebars.registerHelper("formatModuleName", formatModuleName)

Handlebars.registerHelper("formatReturnType", (m: string) => {
    if (m) {
        return `${m.split("|").map(formatModuleName).join("|")}`
    } else {
        return "any"
    }
})

Handlebars.registerHelper("formatNameSpaceToClassName", (m: string) => {
    return m.split(".").pop()
})

Handlebars.registerHelper("formatClassMethodName", (n: string) => {
    return n.split(".").pop()
})

export const formatClassString = (s: UI5Symbol) => {
    if (s.extends && !s.extends.startsWith("sap")) {
        delete s.extends
    }
    if (s.kind == Kind.Class) {
        return templates.classTempalete({ ...s, imports: analysisDependencies(s) })
    } else {
        return ""
    }
}