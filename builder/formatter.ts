
import { UI5Symbol, Kind, Method, MethodParameter, Ui5Metadata } from './types';
import { readFileSync } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as TurnDownService from "turndown";
import { analysisDependencies } from './dependencies';
import { upperFirst, trimStart, trimEnd, } from "lodash";
import { NotExistedTypes } from './not_existed_type';
import { skipMethods } from './wrong_extend_methods';

const turnDownService = new TurnDownService()

const loadTemplate = (p: string) => Handlebars.compile(
    readFileSync(path.join(__dirname, p), { encoding: "UTF-8" })
)

/**
 * templates
 */
const templates = {
    classTemplate: loadTemplate("./templates/class.ts.template"),
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

Handlebars.registerHelper("formatImportReactComponent", (base: string) => {
    if (base == "Object") {
        return `import { Component } from "react"`
    }
    return ""
})

Handlebars.registerHelper("formatBaseName", (base: string) => {
    return base.split(/\.|\//).pop()
})

Handlebars.registerHelper("formatDefault", (name: string, cName: string) => {
    const moduleName = name.split(/\.|\//).pop()
    // a package but not a class
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

const formatDescription = (d: string) => {
    try {
        return turnDownService.turndown(d)
    } catch (error) {
        return d
    }
}

Handlebars.registerHelper("formatDescription", formatDescription)

const formatModuleName = (m: string) => {

    m = m.trim()
    m = trimStart(m, "module:")
    m = m.replace("Promise.", "Promise")
    m = m.replace("Array.", "Array")
    m = m.replace("Object.", "Map")

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
    } else if (m.startsWith("Map<")) {
        const regResult = /Map\<(.*?)\>/.exec(m);
        if (regResult) {
            return `Map<${regResult[1].split(",").map(p => p.trim()).map(formatModuleName).join(",")}>`
        } else {
            return "Map<any>"
        }
    } else if (m.indexOf("|") > 0) {
        return m.split("|").map(formatModuleName).join(" | ")
    } else if (m.startsWith("jQuery")) {
        return "any"
    } else if (m.endsWith("[]")) {
        return `${formatModuleName(trimEnd(m, "[]"))}[]`
    } else if (m.startsWith("sap")) {
        return `Imported${m.split(/\.|\//g).map(upperFirst).join("")}`
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
            case "function()":
                return "Function"
            case "array":
            case "Array":
                return "Array<any>"
            case "ManageObject":
                return formatModuleName("sap.ui.base.ManagedObject")
            case "ControlSelector":
                return formatModuleName("sap.ui.test.RecordReplay.ControlSelector")
            case "UploadSetItem":
                return formatModuleName("sap.m.upload.UploadSetItem")
            case "UploadSet":
                return formatModuleName("sap.m.upload.UploadSet")
            case "int[]":
            case "float[]":
                return "number[]"
            case "List":
            case "Item":
            case "Uploader":
            case "FileUploader":
            case "ap":
            case "*":
            case "DOMRef":
            case "T":
            case "Ref":
            case "DomNode":
            case "LayoutHistory":
                return "any"
            case "function()":
                return "Function"
            case "Map":
            case "Object.<string,function()>":
            case "Object.<string,string>":
                return "Map<any, any>"
            case "Iterator":
                return "Iterator<any>"
            case "{type:string,index:int}":
                return "{ type: string, index: number }"
            default:
                return m
        }
    }
}

Handlebars.registerHelper("formatModuleName", formatModuleName)

const formatReturnType = (m: string) => {
    if (m) {
        return formatModuleName(m)
    } else {
        return "any"
    }
}

const formatClassProps = (s: UI5Symbol): string => {

    var rt = "interface Props { }"
    var items = []

    const formatComment = (obj) => {
        return `/**\n\t\t* ${formatDescription(obj.description || "")}\n\t\t**/`
    }

    // interface with function can not process
    if (s.events) {
        s.events.forEach(e => {
            items.push(`${formatComment(e)}\n\t\t${e.name}?: any`)
        })
    }

    const m = s["ui5-metadata"]
    if (m) {


        if (m.properties) {
            m.properties.forEach(p => {

                items.push(`${formatComment(p)}\n\t\t${p.name}?: ${formatModuleName(p.type)}|PropertyBindingInfo`)
            })
        }
        if (m.aggregations) {

            m.aggregations.forEach(a => {

                items.push(`${formatComment(a)}\n\t\t${a.name}?: ${formatModuleName(a.type)}|AggregationBindingInfo`)
            })
        }
        if (m.associations) {
            m.associations.forEach(a => {

                items.push(`${formatComment(a)}\n\t\t${a.name}?: ${formatModuleName(a.type)}`)
            })
        }

    }
    if (s.extends) {
        var refProps = `${formatModuleName(s.extends)}Props`
        var importD = `import { Props as ${refProps} } from "${s.extends.replace(/\./g, "/")}"`
        rt = `${importD}\n\texport interface Props extends ${refProps} { ${items.map(i => `\n\t\t${i};`).join("")}\n\t}`
    }

    return rt
}

Handlebars.registerHelper("formatClassProps", formatClassProps)

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

Handlebars.registerHelper("formatParameters", (parameters: MethodParameter[]) => {


    if (parameters) {
        let rt = []
        let identifier_seq = 0;
        const identifiers = new Set()
        parameters.forEach(parameter => {

            // with phone name, not a normal function parameter
            if (!parameter.phoneName) {

                // remove non-alpha chars
                let paramName = parameter.name.replace(/[\W_]+/g, "");

                // avoid duplicate identifier in single method
                if (identifiers.has(paramName)) {
                    paramName = `${paramName}_${identifier_seq}`
                    identifier_seq++
                }

                identifiers.add(paramName)

                // make all params as optional, because some optional parameters are before than required parameter
                // "A required parameter cannot follow an optional parameter.""
                rt.push(`${paramName}?: ${parameter.types.map(v => formatModuleName(v.value)).join(" | ")}`)

            }

        })
        rt.push("...objects: any[]")
        return rt.join(", ")

    } else {
        return "...objects: any[]"
    }
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


    if (s.methods) {
        s.methods = s.methods.filter(m => !((s.basename != "Object") && m.name.endsWith("getMetadata")))
        s.methods = s.methods.map(m => {
            if (m.returnValue && skipMethods.includes(m.name)) {
                m.returnValue.type = "any"
            }
            if (m.parameters && skipMethods.includes(m.name)) {
                m.parameters.forEach(p => { p.types = [{ value: "any" }] })
            }
            return m
        })
        s["metadata"] = s["ui5-metadata"]
    }

    return templates.classTemplate({ ...s, imports: analysisDependencies(s) })
}
