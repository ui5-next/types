export { };
declare global {

  interface BaseBindingInfo {
    /**
     * Path in the model to bind to, either an absolute path or relative to the binding context for the corresponding model; when the path contains a '>' sign, the string preceding it will override the model property and the remainder after the '>' will be used as binding path
     */
    path: string;
    /**
     * Name of the model to bind against; when undefined or omitted, the default model is used
     */
    model?: string;
    /**
     * Map of additional parameters for this binding; the names and value ranges of the supported parameters depend on the model implementation, they should be documented with the bindProperty method of the corresponding model class or with the model specific subclass of sap.ui.model.PropertyBinding
     */
    parameters?: object;
    /**
     * Map of event handler functions keyed by the name of the binding events that they should be attached to
     */
    events?: object;
  }


  /**
   * Property Binding information
   */
  interface PropertyBindingInfo extends BaseBindingInfo {

    /**
     * Whether the binding should be suspended initially
     */
    suspended?: boolean;
    /**
     * Function to convert model data into a property value
     */
    formatter?: Function;
    /**
     * Whether the parameters to the formatter function should be passed as raw values. In this case the specified types for the binding parts are not used and the values are not formatted.
  
     * Note: use this flag only when using multiple bindings. If you use only one binding and want raw values then simply don't specify a type for that binding.
     */
    useRawValues?: boolean;
    /**
     * Whether the parameters to the formatter function should be passed as the related JavaScript primitive values. In this case the values of the model are parsed by the model format of the specified types from the binding parts.
  
       Note: use this flag only when using multiple bindings.
     */
    useInternalValues?: boolean;
    /**
     * A type object or the name of a type class to create such a type object; the type will be used for converting model data to a property value (aka "formatting") and vice versa (in binding mode TwoWay, aka "parsing")
     */
    type?: string;

    /**
     * Format options to be used for the type; only taken into account when the type is specified by its name - a given type object won't be modified
     */
    formatOptions?: object;
    /**
     * Additional constraints to be used when constructing a type object from a type name, ignored when a type object is given
     */
    constraints?: object;
    /**
     * Binding mode to be used for this property binding (e.g. one way)
     */
    mode?: any;


    /**
     * Array of binding info objects for the parts of a composite binding; the structure of each binding info is the same as described for the oBindingInfo as a whole.
  
       Note: recursive composite bindings are currently not supported
     */
    parts?: PropertyBindingInfo[];
  }

  interface AggregationBindingInfo extends BaseBindingInfo {

    /**
     * The template to clone for each item in the aggregation; either a template or a factory must be given
     */
    template?: any;
    /**
     * Whether the framework should assume that the application takes care of the lifecycle of the given template; when set to true, the template can be used in multiple bindings, either in parallel or over time, and the framework won't clone it when this ManagedObject is cloned; when set to false, the lifecycle of the template is bound to the lifecycle of the binding, when the aggregation is unbound or when this ManagedObject is destroyed, the template also will be destroyed, and when this ManagedObject is cloned, the template will be cloned as well; the third option (undefined) only exists for compatibility reasons, its behavior is not fully reliable and it may leak the template
     */
    templateShareable?: boolean;

    /**
     * A factory function that will be called to create an object for each item in the aggregation; this is an alternative to providing a template object and can be used when the objects should differ depending on the binding context; the factory function will be called with two parameters: an ID that should be used for the created object and the binding context for which the object has to be created; the function must return an object appropriate for the bound aggregation
     */
    factory?: Function;

    suspended?: boolean;
    startIndex?: number;

    length?: number;
    /**
     * The initial sort order (optional)
     */
    sorter?: any;
    /**
     * The predefined filters for this aggregation (optional)
     */
    filters?: any;
    /**
     * Name of the key property or a function getting the context as only parameter to calculate a key for entries. This can be used to improve update behavior in models, where a key is not already available.
     */
    key?: string | Function;
    /**
     * A factory function to generate custom group visualization (optional)
     */
    groupHeaderFactory?: Function

  }

}