
import { trimPrefix } from "@newdash/newdash/trimPrefix";
import { trimSuffix } from "@newdash/newdash/trimSuffix";
import upperFirst from "@newdash/newdash/upperFirst";
import { readFileSync } from "fs";
import * as Handlebars from "handlebars";
import * as path from "path";
import * as TurnDownService from "turndown";
import { analysisDependencies } from './dependencies';
import { NotExistedTypes } from './not_existed_type';
import { MethodParameter, Stereotype, UI5Symbol } from './types';
import { secureSplit } from './utils';
import { skipMethods } from './wrong_extend_methods';



const turnDownService = new TurnDownService();

const loadTemplate = (p: string) => Handlebars.compile(
  readFileSync(path.join(__dirname, p), { encoding: "utf8" })
);

/**
 * templates
 */
const templates = {
  classTemplate: loadTemplate("../templates/class.ts.template"),
  enumTemplate: loadTemplate("../templates/enum.ts.template"),
  typeTemplate: loadTemplate("../templates/types.ts.template"),
  nsTypeTemplate: loadTemplate("../templates/ns.type.ts.template"),
  nsClassTemplate: loadTemplate("../templates/ns.class.ts.template"),
  nsNodeTemplate: loadTemplate("../templates/ns.node.ts.template"),
  funcTemplate: loadTemplate("../templates/func.ts.template")
};

Handlebars.registerHelper("formatNameSpaceToModule", (m: string) => {
  return trimPrefix(m, "module:").replace(/\./g, "/");
});

Handlebars.registerHelper("extractImportClassName", (m: string) => {
  return `Imported${m.split("/").pop()}`;
});

Handlebars.registerHelper("formatImportReactComponent", (base: string) => {
  if (base == "Object") {
    return `import { Component } from "react"`;
  }
  return "";
});

Handlebars.registerHelper("formatBaseName", (base: string) => {
  return base.split(/\.|\//).pop();
});

Handlebars.registerHelper("formatDefault", (name: string, cName: string) => {
  const moduleName = name.split(/\.|\//).pop();
  // a package but not a class
  if (moduleName.toLowerCase() == moduleName) {
    return "";
  } else {
    // 
    if (moduleName.endsWith(cName)) {
      return "default ";
    } else {
      return "";
    }

  }
});

const formatDescription = (d: string, resource = "https://openui5.hana.ondemand.com/resources/") => {
  try {
    return turnDownService.turndown(d) || "";
  } catch (error) {
    return d;
  }
};

Handlebars.registerHelper("formatDescription", formatDescription);

export const extractGeneric = (s = "") => {
  const r = /^([a-zA-Z]*?)<\(?(.*?)\)?\>$/g;
  const a = r.exec(s);
  if (a) {
    const generic = a[1];
    const inner = a[2];
    if (s.startsWith(`${generic}<`)) {
      return {
        generic,
        inner
      };
    } else {
      return null;
    }

  } else {
    return null;
  }
};

export const formatModuleName = (m = "") => {

  m = m.trim();
  m = m.replace("module:", "");
  m = m.replace("sap.ui.fl.Utils.FakePromise", "Promise");
  m = m.replace("Promise.", "Promise");
  m = m.replace("Array.", "Array");
  m = m.replace("Object.", "Map");

  switch (m) {

    case "int":
    case "float":
    case "Infinity":
      return "number";
    case "bject[]":
      return "object[]";
    case "bject":
      return "object";
    case "object<string,string>":
    case "object<string, string>":
      return "Record<string, string>";
    case "Promise":
      return "Promise<any>";
    case "Promise<function(>":
      return "Promise<Function>";
    case "ndefined":
      return "undefined";
    case "function":
    case "function(":
    case "function()":
      return "Function";
    case "array":
    case "Array":
      return "Array<any>";
    case "Array<{type:string,index:int}>":
      return "Array<{type:string,index:number}>";
    case "ManageObject":
      return formatModuleName("sap.ui.base.ManagedObject");
    case "ControlSelector":
      return formatModuleName("sap.ui.test.RecordReplay.ControlSelector");
    case "UploadSetItem":
      return formatModuleName("sap.m.upload.UploadSetItem");
    case "UploadSet":
      return formatModuleName("sap.m.upload.UploadSet");
    case "sap/ui/core/ComponentContainer)":
    case "sap.ui.core.ComponentContainer)":
      return formatModuleName("sap.ui.core.ComponentContainer");
    case "int[]":
    case "float[]":
      return "number[]";
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
      return "any";
    case "Map":
    case "Map<any>":
      return "Map<any, any>";
    case "Iterator":
      return "Iterator<any>";
    default:
      if (NotExistedTypes.includes(m.replace(/\//g, "."))) {
        return "any";
      }

      const generic = extractGeneric(m);

      if (generic) {

        const { inner } = generic;

        const parts1 = secureSplit(inner, ",");

        if (parts1.length > 1) {
          return `${generic.generic}<${formatModuleName(parts1.map(p => p.trim()).map(formatModuleName).join(", "))}>`;
        }

        const parts2 = secureSplit(inner, "|");

        if (parts2.length > 1) {
          return `${generic.generic}<${formatModuleName(parts2.map(p => p.trim()).map(formatModuleName).join(" | "))}>`;
        }

        return `${generic.generic}<${formatModuleName(inner)}>`;

      } else if (m.startsWith("(") && m.endsWith(")")) {
        return formatModuleName(m.substr(1, m.length - 2));
      } else if (m.indexOf("|") > 0) {
        return secureSplit(m, "|").map(formatModuleName).join(" | ");
      } else if (m.startsWith("jQuery")) {
        return "any";
      } else if (m.endsWith("[]")) {
        return `${formatModuleName(trimSuffix(m, "[]"))}[]`;
      } else if (m.startsWith("sap")) {
        // @ts-ignore
        return `Imported${trimSuffix(m, ")").split(/\.|\//g).map(upperFirst).join("")}`;
      } else {
        return m;
      }
  }

};

Handlebars.registerHelper("formatModuleName", formatModuleName);

const formatReturnType = (m: string) => {
  if (m) {
    return formatModuleName(m);
  } else {
    return "any";
  }
};

const formatClassConstructor = (s: UI5Symbol): string => {
  let rt = "constructor(...any: any[])";
  withUIControl(s, () => {
    rt = "constructor(props?: Props & T)";
  });
  return rt;
};

Handlebars.registerHelper("formatClassConstructor", formatClassConstructor);

const withUIControl = (s: UI5Symbol, cb: (s: UI5Symbol) => void) => {
  if (s && s["ui5-metadata"] && (s["ui5-metadata"].stereotype == Stereotype.Control || s["ui5-metadata"].stereotype == Stereotype.Element)) {
    cb(s);
  }
};

const formatClassProps = (s: UI5Symbol): string => {

  let rt = "interface Props { }";
  const items = [];

  const formatComment = (obj) => {
    return `/**\n\t\t* ${formatDescription(obj.description || "")}\n\t\t**/`;
  };

  // interface with function can not process
  if (s.events) {
    s.events.forEach(e => {
      items.push(`${formatComment(e)}\n\t\t${e.name}?: any`);
    });
  }

  const m = s["ui5-metadata"];

  if (m) {

    // ref https://github.com/ui5-next/types/issues/11
    // Hard code to add props - id to the class Control
    if (s.name == "sap.ui.core.Control") {
      items.push(`/**
    * Optional ID for the new control; generated automatically if no non-empty ID is given
    * 
    * **Note: this can be omitted, no matter whether mSettings will be given or not!**
    */
    id?: string`);
      items.push(`/**
    * Static Class Style Name
    */
    class?: string`);
    }

    if (m.properties) {
      m.properties.forEach(p => {

        items.push(`${formatComment(p)}\n\t\t${p.name}?: ${formatModuleName(p.type)}|PropertyBindingInfo|ExpressionBindingInfo`);
      });
    }
    if (m.aggregations) {

      m.aggregations.forEach(a => {

        items.push(`${formatComment(a)}\n\t\t${a.name}?: ${formatModuleName(a.type)}|AggregationBindingInfo`);
      });
    }
    if (m.associations) {
      m.associations.forEach(a => {

        items.push(`${formatComment(a)}\n\t\t${a.name}?: ${formatModuleName(a.type)}`);
      });
    }

  }
  if (s.extends) {
    const refProps = `${formatModuleName(s.extends)}Props`;
    const importD = `import { Props as ${refProps} } from "${s.extends.replace(/\./g, "/")}"`;
    rt = `${importD}\n\texport interface Props extends ${refProps} { ${items.map(i => `\n\t\t${i};`).join("")}\n\t}`;
  }

  return rt;
};

Handlebars.registerHelper("formatClassProps", formatClassProps);

Handlebars.registerHelper("formatReturnType", formatReturnType);

Handlebars.registerHelper("formatClassGenericTag", (s: UI5Symbol) => {
  let rt = "";
  withUIControl(s, () => {
    rt = "<T = {}>";
  });
  return rt;
});

Handlebars.registerHelper("formatClassPropsDefinition", (s: UI5Symbol) => {
  let rt = "";
  withUIControl(s, () => {
    rt = "props: Props & T";
  });
  return rt;
});

Handlebars.registerHelper("formatLastPart", (m: string) => {
  return m.split(/\.|\//).pop();
});

Handlebars.registerHelper("formatNameSpaceToClassName", (m: string) => {
  return m.split(".").pop();
});

Handlebars.registerHelper("formatClassMethodName", (n: string) => {
  return n.split(".").pop();
});

Handlebars.registerHelper("formatStandaloneFunctionName", (n: string) => {
  return n.split("/").pop();
});

Handlebars.registerHelper("formatParameters", (parameters: MethodParameter[]) => {


  if (parameters) {
    const rt = [];
    let identifier_seq = 0;
    const identifiers = new Set();
    parameters.forEach(parameter => {

      // with phone name, not a normal function parameter
      if (!parameter.phoneName) {

        // remove non-alpha chars
        let paramName = parameter.name.replace(/[\W_]+/g, "");

        // avoid duplicate identifier in single method
        if (identifiers.has(paramName)) {
          paramName = `${paramName}_${identifier_seq}`;
          identifier_seq++;
        }

        identifiers.add(paramName);

        // make all params as optional, because some optional parameters are before than required parameter
        // "A required parameter cannot follow an optional parameter.""
        rt.push(`${paramName}?: ${parameter.types.map(v => formatModuleName(v.value)).join(" | ")}`);

      }

    });
    rt.push("...objects: any[]");
    return rt.join(", ");

  } else {
    return "...objects: any[]";
  }
});

/**
 * format enum type string
 */
export const formatEnumString = (s: UI5Symbol) => {
  return templates.enumTemplate(s);
};

export const formatTypeString = (s: UI5Symbol) => {
  return templates.typeTemplate({ ...s, imports: analysisDependencies(s) });
};

export const formatNsType = (s: UI5Symbol) => {
  return templates.nsTypeTemplate(s);
};

export const formatInterfaceString = (s: UI5Symbol) => {
  return templates.typeTemplate(s);
};

export const formatFunctionString = (s: UI5Symbol) => {
  return templates.funcTemplate(s);
};

export const formatPureNsNode = (s: UI5Symbol) => {
  return templates.nsNodeTemplate(s);
};

export const formatNsClassString = (s: UI5Symbol) => {
  // it maybe extends from native js object
  if (s.extends && !s.extends.startsWith("sap")) {
    delete s.extends;
  }
  if (s.methods) {
    s.methods = s.methods.filter(m => !((s.basename != "Object") && m.name.endsWith("getMetadata")));
    s.methods = s.methods.map(m => {
      if (m.returnValue && skipMethods.includes(m.name)) {
        m.returnValue.type = "any";
      }
      if (m.parameters && skipMethods.includes(m.name)) {
        m.parameters.forEach(p => { p.types = [{ value: "any" }]; });
      }
      return m;
    });
    s["metadata"] = s["ui5-metadata"];
  }

  return templates.nsClassTemplate({ ...s, imports: analysisDependencies(s) });
};


export const formatClassString = (s: UI5Symbol) => {
  // it maybe extends from native js object
  if (s.extends && !s.extends.startsWith("sap")) {
    delete s.extends;
  }

  // it extends from not existed type, remove it
  if (NotExistedTypes.includes(s.extends)) {
    delete s.extends;
  }

  if (s.methods) {
    s.methods = s.methods.filter(m => !((s.basename != "Object") && m.name.endsWith("getMetadata")));
    s.methods = s.methods.map(m => {
      if (m.returnValue && skipMethods.includes(m.name)) {
        m.returnValue.type = "any";
      }
      if (m.parameters && skipMethods.includes(m.name)) {
        m.parameters.forEach(p => { p.types = [{ value: "any" }]; });
      }
      return m;
    });
    s["metadata"] = s["ui5-metadata"];
  }

  return templates.classTemplate({ ...s, imports: analysisDependencies(s) });
};
