
import { UI5Symbol, Kind, Method } from './types';
import { readFileSync } from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as TurnDownService from "turndown";

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
        return templates.classTempalete(s)
    } else {
        return ""
    }
}