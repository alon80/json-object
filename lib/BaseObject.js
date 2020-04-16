'use strict';

const PropertyType = require('./PropertyType.js');

class BaseObject {

    #json = null;
    #propertyMapping = {};

    constructor(json) {
        this.#json = json;
    }

    get(key, def = null) {
        const possibleKeys = [key];
        if (key.startsWith('_')) {
            possibleKeys.push(key.substring(1));
        } else {
            possibleKeys.push(`_${key}`);
        }
        for (const key of possibleKeys) {
            if (this.#json.hasOwnProperty(key)) {
                return this.#json[key];
            }
        }
        return def;
    }

    getString(key, def) {
        const res = this.get(key);
        if (res !== null) {
            return String(res);
        }
        return def;
    }

    getInt(key, def) {
        let res = this.get(key);
        if (res !== null) {
            res = parseInt(res);
            if (!isNaN(res)) {
                return res;
            }
        }
        return def;
    }

    getFloat(key, def) {
        let res = this.get(key);
        if (res !== null) {
            res = parseFloat(res);
            if (!isNaN(res)) {
                return res;
            }
        }
        return def;
    }

    getBoolean(key, def) {
        let res = this.get(key);
        if (res !== null) {
            res = res === 'false' ? false : Boolean(res);
            return res;
        }
        return def;
    }

    getArray(key, def) {
        const res = this.get(key);
        if (res !== null) {
            if (Array.isArray(res)) {
                return res;
            }
        }
        return def;
    }

    getObject(key, def) {
        const res = this.get(key);
        if (res !== null) {
            if (typeof res === 'object') {
                return res;
            }
        }
        return def;
    }

    toJSON() {
        let json = {};
        Object.keys(this).forEach((key) => {
            let newKey = key;
            if (this.#propertyMapping[key]) {
                newKey = this.#propertyMapping[key];
            }
            else if (key.startsWith('_')) {
                newKey = key.substring(1);
            }
            json[newKey] = this[key];
        });
        return json;
    }

    build() {
        Object.keys(this).forEach((key) => {
            const propertyType = this[key];
            if (propertyType.mapTo) {
                this.#propertyMapping[key] = propertyType.mapTo;
            }

            let jsonKey = key;
            if (key.startsWith('_')) {
                jsonKey = key.substring(1);
                if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), jsonKey).set) {
                    key =  key.substring(1);
                }
            }

            if (propertyType.mapFrom) {
                jsonKey = propertyType.mapFrom;
            }

            switch (propertyType.type) {
                case PropertyType.types().STRING:
                    this[key] = this.getString(jsonKey, propertyType.def);
                    break;
                case PropertyType.types().INTEGER:
                    this[key] = this.getInt(jsonKey, propertyType.def);
                    break;
                case PropertyType.types().FLOAT:
                    this[key] = this.getFloat(jsonKey, propertyType.def);
                    break;
                case PropertyType.types().BOOLEAN:
                    this[key] = this.getBoolean(jsonKey, propertyType.def);
                    break;
                case PropertyType.types().ARRAY:
                    this[key] = this.getArray(jsonKey, propertyType.def);
                    if (propertyType.class && Array.isArray(this[key])) {
                        this[key].forEach((item, index) => {
                            this[key][index] = new propertyType.class(item);
                        });
                    }
                    break;
                case PropertyType.types().OBJECT:
                    if (propertyType.class) {
                        try {
                            this[key] = new propertyType.class(this.getObject(jsonKey, propertyType.def));
                        } catch (e) {
                            console.log(e.toString());
                        }
                    } else {
                        this[key] = this.getObject(jsonKey, propertyType.def);
                    }
                    break;
            }
            if (typeof this[key] === 'undefined') {
                delete this[key];
            }
        });
    }

    static fromJSON(json) {
        return new this(json);
    }
}

module.exports = BaseObject;
