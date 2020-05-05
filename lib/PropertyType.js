'use strict';

class PropertyType {

    constructor(type, options = {}) {
        this.type = type;
        this.def = options.def;
        this.mapFrom = options.mapBoth || options.mapFrom;
        this.mapTo = options.mapBoth || options.mapTo;
        this.class = options.class;
        if (options.transformTo instanceof PropertyType && typeof options.transformTo.setWith === 'function') {
            this.transformTo = options.transformTo;
        }
        if (typeof options.setWith === 'function') {
            this.setWith = options.setWith;
        }
        if (this.setWith) {
            this.useSetterOnInit = false;
        } else {
            if (typeof options.useSetterOnInit === 'undefined') {
                this.useSetterOnInit = true;
            } else {
                this.useSetterOnInit = Boolean(options.useSetterOnInit);
            }
        }

        this.deleteIfUndefined = options.deleteIfUndefined === 'false' ? false : Boolean(options.deleteIfUndefined);

        if (typeof this.def === 'undefined' && !this.deleteIfUndefined) {
            this.def = PropertyType.getDefaultValueByType(type);
        }

    }

    init() {
        if (this.transformTo) {
            return this.transformTo.def;
        }
        return this.def;
    }

    static integer(options) {
        return new PropertyType(PropertyType.types().INTEGER, options);
    }

    static float(options) {
        return new PropertyType(PropertyType.types().FLOAT, options);
    }

    static boolean(options) {
        return new PropertyType(PropertyType.types().BOOLEAN, options);
    }

    static string(options) {
        return new PropertyType(PropertyType.types().STRING, options);
    }

    static object(options) {
        return new PropertyType(PropertyType.types().OBJECT, options);
    }

    static array(options) {
        return new PropertyType(PropertyType.types().ARRAY, options);
    }

    static map(options) {
        return new PropertyType(PropertyType.types().MAP, options);
    }

    static types() {
        return {
            INTEGER: 'int',
            FLOAT: 'float',
            BOOLEAN: 'bool',
            STRING: 'string',
            ARRAY: 'array',
            OBJECT: 'object',
            MAP: 'map',
        };
    }

    static getDefaultValueByType(type) {
        switch (type) {
            case PropertyType.types().INTEGER:
                return 0;
            case PropertyType.types().FLOAT:
                return 0.0;
            case PropertyType.types().BOOLEAN:
                return false;
            case PropertyType.types().STRING:
                return null;
            case PropertyType.types().ARRAY:
                return [];
            case PropertyType.types().OBJECT:
                return null;
            case PropertyType.types().MAP:
                return null;
            default:
                return null;
        }
    }


}
module.exports = PropertyType;
