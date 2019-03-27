
import { UI5Symbol, Kind, Method } from './types';
import { readFileSync } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as TurnDownService from "turndown";
import { analysisDependencies } from './dependencies';
import { upperFirst, trimStart, trimEnd, } from "lodash";
import { NotExistedTypes } from './not_existed_type';

const turnDownService = new TurnDownService()

const loadTemplate = (p: string) => Handlebars.compile(
    readFileSync(path.join(__dirname, p), { encoding: "UTF-8" })
)

/**
 * templates
 */
const templates = {
    classTempalete: loadTemplate("./templates/class.ts.template"),
    enumTemplate: loadTemplate("./templates/enum.ts.template"),
    typeTemplate: loadTemplate("./templates/types.ts.template"),
    nsTypeTemplate: loadTemplate("./templates/ns.type.ts.template"),
}

Handlebars.registerHelper("formatNameSpaceToModule", (m: string) => {
    return trimStart(m, "module:").replace(/\./g, "/")
})

Handlebars.registerHelper("extractImportClassName", (m: string) => {
    return `Imported${m.split("/").pop()}`
})

Handlebars.registerHelper("formatBaseName", (base: string) => {
    return base.split(/\.|\//).pop()
})


Handlebars.registerHelper("formatDefault", (name: string, cName: string) => {
    const moduleName = name.split(/\.|\//).pop()
    // a pacakge but not a class
    if (moduleName.toLowerCase() == moduleName) {
        return ""
    } else {
        // 
        if (moduleName.endsWith(cName)) {
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
    m = m.replace("Promise.", "Promise")
    if (NotExistedTypes.includes(m.replace(/\//g, "."))) {
        return "any"
    } else if (m.startsWith("Promise<")) {
        const regResult = /Promise\<(.*?)\>/.exec(m);
        if (regResult) {
            return `Promise<${formatModuleName(regResult[1])}>`
        } else {
            return "Promise<any>"
        }
    } else if (m.startsWith("Array<")) {
        const regResult = /Array\<(.*?)\>/.exec(m);
        if (regResult) {
            return `Array<${formatModuleName(regResult[1])}>`
        } else {
            return "Array<any>"
        }
    } else if (m.startsWith("jQuery")) {
        return "any"
    } else if (m.startsWith("sap")) {
        return `Imported${m.split(/\.|\//g).map(upperFirst).join("")}`
    } else if (m.endsWith("[]")) {
        return `${formatModuleName(trimEnd(m, "[]"))}[]`
    } else {
        switch (m) {
            case "int":
            case "float":
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
            case "ControlSelector":
                return formatModuleName("sap.ui.test.RecordReplay.ControlSelector")
            case "int[]":
            case "float[]":
                return "number[]"
            case "ap":
            case "*":
            case "DOMRef":
            case "T":
            case "Ref":
            case "DomNode":
                return "any"
            case "Array":
                return "Array<any>"
            case "function()":
                return "Function"
            default:
                return m
        }
    }
}

Handlebars.registerHelper("formatModuleName", formatModuleName)

const formatReturnType = (m: string) => {
    if (m) {
        if (m.startsWith("Array.")) {
            m = m.replace("Array.", "Array")
        }
        if (m.startsWith("Promise") && (!m.startsWith("Promise|")) && m.indexOf("|") > 0) {
            const regResult = /Promise\.?\<(.*?)\>/.exec(m);
            if (regResult) {
                return `Promise<${formatReturnType(regResult[1])}>`
            } else {
                return "Promise<any>"
            }
        } else if (m.startsWith("Array") && (!m.startsWith("Array|")) && m.indexOf("|") > 0) {
            const regResult = /Array\.?\<(.*?)\>/.exec(m);
            if (regResult) {
                return `Array<${formatReturnType(regResult[1])}>`
            } else {
                return "Array<any>"
            }
        } else if (m.endsWith("[]")) {
            return `${formatReturnType(trimEnd(m, "[]"))}[]`
        } else {
            return `${m.split("|").map(formatModuleName).join("|")}`
        }
    } else {
        return "any"
    }
}

Handlebars.registerHelper("formatReturnType", formatReturnType)

Handlebars.registerHelper("formatLastPart", (m: string) => {
    return m.split(/\.|\//).pop()
})

Handlebars.registerHelper("formatNameSpaceToClassName", (m: string) => {
    return m.split(".").pop()
})

Handlebars.registerHelper("formatClassMethodName", (n: string) => {
    return n.split(".").pop()
})

/**
 * format enum type string
 */
export const formatEnumString = (s: UI5Symbol) => {
    return templates.enumTemplate(s)
}

export const formatTypeString = (s: UI5Symbol) => {
    return templates.typeTemplate({ ...s, imports: analysisDependencies(s) })
}

export const formatNsType = (s: UI5Symbol) => {
    return templates.nsTypeTemplate(s)
}

export const formatInterfaceString = (s: UI5Symbol) => {
    return templates.typeTemplate(s)
}


export const formatClassString = (s: UI5Symbol) => {
    // it maybe extends from native js object
    if (s.extends && !s.extends.startsWith("sap")) {
        delete s.extends
    }
    // those method return type will be any
    // because there parameters are different in parent-class & sub-class
    const skipMethods = [
        "sap.ui.base.Object.defineClass",
        "parseValue",
        "setVisible",
        "getDomRef",
        "getControlMessages",
        "clone",
        "setDatetime",
        "getTooltip",
        "setValue",
        "getValue",
        "setAuthorPicture",
        "setPriority",
    ]

    if (s.methods) {
        s.methods = s.methods.filter(m => !((s.basename != "Object") && m.name.endsWith("getMetadata")))
        s.methods = s.methods.map(m => {
            if (m.returnValue && skipMethods.includes(m.name)) {
                m.returnValue.type = "any"
            }
            return m
        })
    }
    return templates.classTempalete({ ...s, imports: analysisDependencies(s) })
}