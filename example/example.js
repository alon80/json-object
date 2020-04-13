const {BaseObject, PropertyType} = require('../index');

class Product extends BaseObject {
    _id = PropertyType.integer();
    _productName = PropertyType.string({mapFrom: 'product_name'});
    _price = PropertyType.float();
    _inStock = PropertyType.boolean({mapFrom: 'in_stock'});
    _description = PropertyType.string({def: 'This item has no description'});
    _seller = PropertyType.object({class: Seller});
    _images = PropertyType.array({class: Image, deleteIfUndefined: true});

    constructor(json) {
        super(json);
        this.build();
    }
}

class Seller extends BaseObject {

    _name = PropertyType.string();
    _email = PropertyType.string();

    constructor(json) {
        super(json);
        this.build();
    }
}

class Image extends BaseObject {

    _height = PropertyType.integer({mapTo: 'h'});
    _width = PropertyType.integer({mapTo: 'w'});
    _title = PropertyType.string({deleteIfUndefined: true});
    _url = PropertyType.string();

    constructor(json) {
        super(json);
        this.build();
    }
}

const json = require('./example.json');
// method 1:
const product = new Product(json);
// Method 2:
// const product = Product.fromJSON(json);

console.log(JSON.stringify(product));


