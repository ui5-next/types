export interface UI5APIRef {
    "$schema-ref": string;
    version: string;
    library: string;
    symbols: UI5Symbol[];
    defaultComponent: Component;
}

export enum Component {
    CAUi5Cor = "CA-UI5-COR",
    CAUi5Ctr = "CA-UI5-CTR",
    CAUi5Fst = "CA-UI5-FST",
    CAUi5Tbl = "CA-UI5-TBL",
    CAWdeMck = "CA-WDE-MCK",
}

export interface UI5Symbol {
    kind: Kind;
    name: string;
    basename?: string;
    resource?: string;
    module?: string;
    export?: string;
    visibility?: ConstructorVisibility;
    description?: string;
    methods?: Method[];
    displayName: string;
    nodes?: Node[];
    hasSample: boolean;
    title: string;
    subTitle: SubTitle;
    static?: boolean;
    deprecatedText?: string;
    properties?: SymbolProperty[];
    constructor?: Constructor;
    component?: Component;
    since?: string;
    references?: string[];
    parameters?: SymbolParameter[];
    returnValue?: ThrowClass;
    examples?: SymbolExample[];
    throws?: ThrowClass[];
    abstract?: boolean;
    extends?: string;
    experimental?: DeprecatedClass;
    "ui5-metadata"?: Ui5Metadata;
    implements?: string[];
    events?: Event[];
    final?: boolean;
    "ui5-metamodel"?: boolean;
    docuLink?: string;
    docuLinkText?: string;
}

export interface Constructor {
    visibility: ConstructorVisibility;
    description?: string;
    references: string[];
    codeExample: string;
    parameters?: ConstructorParameter[];
    examples?: ConstructorExample[];
    throws?: Throw[];
}

export interface ConstructorExample {
    data: string;
}

export interface ConstructorParameter {
    name: string;
    optional: boolean;
    description?: string;
    phoneName: string;
    depth: number;
    types: PurpleType[];
    defaultValue: boolean | PurpleDefaultValue | number;
}

export enum PurpleDefaultValue {
    Auto = "\"$auto\"",
    DateNow = "Date.now()",
    Default = "Default",
    DefaultValue = "\"\"",
    Empty = "",
    Infinity = "Infinity",
    Merge = "Merge",
    ModuleSapUIUtilStorageTypeSession = "module:sap/ui/util/Storage.Type.session",
    OneWay = "OneWay",
    Request = "Request",
    SapUICoreMessageTypeNone = "sap.ui.core.MessageType.None",
    SapUIModelTreeAutoExpandModeBundled = "sap.ui.model.TreeAutoExpandMode.Bundled",
    StateKey = "'state.key_'",
    The20 = "'2.0'",
    The40 = "\"4.0\"",
    Window = "window",
}

export interface PurpleType {
    name: string;
    linkEnabled: boolean;
}

export interface Throw {
    type?: TypeEnum;
    description?: string;
    linkEnabled?: boolean;
}

export enum TypeEnum {
    Error = "Error",
    SapUIModelFormatException = "sap.ui.model.FormatException",
    SapUIModelParseException = "sap.ui.model.ParseException",
    SapUIModelValidateException = "sap.ui.model.ValidateException",
    SyntaxError = "SyntaxError",
    TypeError = "TypeError",
}

export enum ConstructorVisibility {
    Protected = "protected",
    Public = "public",
    Restricted = "restricted",
}

export interface Event {
    name: string;
    visibility: ConstructorVisibility;
    parameters?: EventParameter[];
    description?: string;
    since?: string;
    module?: string;
    resource?: string;
}

export interface EventParameter {
    name: string;
    type: string;
    linkEnabled?: boolean;
    description: string;
    optional?: boolean;
    depth?: number;
    phoneName?: string;
}

export interface SymbolExample {
    text: string;
    caption?: string;
}

export interface DeprecatedClass {
    since?: string;
    text?: string;
}

export enum Kind {
    Class = "class",
    Enum = "enum",
    Function = "function",
    Interface = "interface",
    Namespace = "namespace",
    Typedef = "typedef",
}

export interface Method {
    name: string;
    module?: string;
    visibility: ConstructorVisibility;
    since?: string;
    returnValue?: ReturnValue;
    parameters?: MethodParameter[];
    description?: string;
    resource?: string;
    href: string;
    code: string;
    deprecated?: DeprecatedClass;
    deprecatedText?: string;
    export?: string;
    static?: boolean;
    references?: string[];
    experimental?: DeprecatedClass;
    throws?: Throw[];
    examples?: ConstructorExample[];
    "ui5-metamodel"?: boolean;
}

export interface MethodParameter {
    name: string;
    optional: boolean;
    description: string;
    types: ReturnValueType[];
    defaultValue: boolean | FluffyDefaultValue | number;
    depth?: number;
    phoneName?: string;
}

export enum FluffyDefaultValue {
    Any = "'any'",
    Component = "'component'",
    Day = "\"day\"",
    Default = "'default'",
    DefaultValue = "[]",
    DefaultValueDefault = "Default",
    DefaultValueDocument = "document",
    DefaultValueGET = "'GET'",
    DefaultValueJavascript = "[\"javascript\"]",
    Document = "[document]",
    DocumentActiveElement = "document.activeElement",
    Empty = "",
    Flip = "'flip'",
    Fluffy = "'./'",
    Get = "GET",
    Global = "global",
    HalfAwayFromZero = "HALF_AWAY_FROM_ZERO",
    JS = "'.js'",
    Javascript = "\"javascript\"",
    Last = "\"last\"",
    LengthOfTheList = "length of the list",
    LevelDEBUG = "Level.DEBUG",
    New = "'new'",
    None = "\"none\"",
    Purple = "''",
    RenderManager = "RenderManager",
    SapUICore = "'sap.ui.core'",
    SapUICorePopupDockCenterCenter = "sap.ui.core.Popup.Dock.CenterCenter",
    SapUIModelFilterTypeApplication = "sap.ui.model.FilterType.Application",
    SapUIModelFilterTypeControl = "sap.ui.model.FilterType.Control",
    Standard = "standard",
    Sticky = "{}",
    Tentacled = "\"\"",
    Text = "'text'",
    The00 = "'0 0'",
    The10 = "'1.0'",
    TowardsZero = "TOWARDS_ZERO",
    V2ODataModelSizeLimit = "v2.ODataModel.sizeLimit",
    Wide = "\"wide\"",
    Window = "window",
    XML = "XML",
}

export interface ReturnValueType {
    value: string;
    linkEnabled?: boolean;
    href?: string;
}

export interface ReturnValue {
    type?: string;
    description: string;
    types?: ReturnValueType[];
}

export interface Node {
    name: string;
    description: string;
}

export interface SymbolParameter {
    name: string;
    type: string;
    optional: boolean;
    description: string;
    defaultValue?: boolean | FluffyDefaultValue | number | null;
    parameterProperties?: ParameterProperties;
}

export interface ParameterProperties {
    url: Attributes;
    id: Attributes;
    attributes: Attributes;
}

export interface Attributes {
    name: string;
    type: string;
    optional: boolean;
    description: string;
}

export interface SymbolProperty {
    name: string;
    visibility: ConstructorVisibility;
    type?: string;
    description: string;
    deprecated?: DeprecatedClass;
    experimental?: PurpleExperimental;
    references?: string[];
    since?: string;
    module?: string;
    export?: string;
    resource?: string;
    linkEnabled?: boolean;
    href?: string;
    examples?: PropertyExample[];
}

export interface PropertyExample {
    text: string;
}

export interface PurpleExperimental {
}

export interface ThrowClass {
    type: string;
    description: string;
}

export enum SubTitle {
    DeprecatedInVersion112 = "Deprecated in version: 1.1.2",
    DeprecatedInVersion1142 = "Deprecated in version: 1.14.2",
    DeprecatedInVersion1151 = "Deprecated in version: 1.15.1",
    DeprecatedInVersion1191 = "Deprecated in version: 1.19.1",
    DeprecatedInVersion120 = "Deprecated in version: 1.20",
    DeprecatedInVersion122 = "Deprecated in version: 1.22",
    DeprecatedInVersion148 = "Deprecated in version: 1.48",
    DeprecatedInVersion156 = "Deprecated in version: 1.56",
    DeprecatedInVersion1560 = "Deprecated in version: 1.56.0",
    DeprecatedInVersion158 = "Deprecated in version: 1.58",
    Empty = "",
}

export interface Ui5Metadata {
    stereotype?: Stereotype;
    properties?: Ui5MetadataProperty[];
    aggregations?: Aggregation[];
    specialSettings?: SpecialSetting[];
    basetype?: string;
    pattern?: string;
    associations?: Association[];
    designtime?: string;
    defaultAggregation?: string;
}

export interface Aggregation {
    name: string;
    singularName: string;
    type: string;
    cardinality: Cardinality;
    visibility: AggregationVisibility;
    methods: string[];
    linkEnabled: boolean;
    description: string;
    since?: string;
    altTypes?: string[];
    bindable?: boolean;
}

export enum Cardinality {
    The01 = "0..1",
    The0N = "0..n",
}

export enum AggregationVisibility {
    Hidden = "hidden",
    Public = "public",
}

export interface Association {
    name: string;
    singularName: string;
    type: string;
    cardinality: Cardinality;
    visibility: AggregationVisibility;
    description: string;
    methods: string[];
    linkEnabled: boolean;
}

export interface Ui5MetadataProperty {
    name: string;
    type: string;
    defaultValue: boolean | number | string;
    group: Group;
    visibility: ConstructorVisibility;
    methods: string[];
    description: string;
    linkEnabled?: boolean;
    since?: string;
}

export enum Group {
    Accessibility = "Accessibility",
    Appearance = "Appearance",
    Behavior = "Behavior",
    Data = "Data",
    Dimension = "Dimension",
    Misc = "Misc",
}

export interface SpecialSetting {
    name: string;
    type: string;
    visibility: AggregationVisibility;
    description: string;
    linkEnabled?: boolean;
    since?: string;
}

export enum Stereotype {
    Component = "component",
    Control = "control",
    Datatype = "datatype",
    Element = "element",
    Object = "object",
}
