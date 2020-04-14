# JSON Object Model

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  * [`PropertyTypes`](#basic)
  * [`options.mapFrom` & `options.mapTo`](#-optionsmapfrom-----optionsmapto-)
  * [`options.class`](#-optionsclass-)
  * [`options.def`](#-optionsdef-)
  * [`options.deleteIfUndefined`](#optionsdeleteifundefined)
- [Full Example](#full-example)
- [What's next](#what-s-next)


## Installation
`npm i @alon80/json-object`

## Features

* Model your classes easily
* Strictly typed properties (primitives, arrays, objects or even your other custom objects)
* Construct with json or any other object (for example: expressJS `req.query` object)
* Define default values
* Map property names inputs and outputs (inspired by gson annotations)
* Use '_' prefix if you would like to use your custom setters or getters


## Usage

### `PropertyTypes`


```js
const {BaseObject, PropertyType} = require('@alon80/json-object');

class Album extends BaseObject {

    _id = PropertyType.integer();
    // You can also use without the "_" prefix:
    // id = PropertyType.integer();
    _name = PropertyType.string();
    _artist = PropertyType.object();
    _songs = PropertyType.array();
    
    // Call super constructor and the call the build method
    constructor(json) {
        super(json);
        this.build();
    }
}
```

##### Create instance:

```js
const json = {id: 1234, name: 'The Flying Eggplant'};
// Method 1:
const album = new Album(json);
// Method 2:
const album = Album.fromJSON(json);
```
##### Outputs:

```js
console.log(album);
/**
 Output:
 Album {
   _id: 1234,
   _name: 'The Flying Eggplant',
   _artist: null,
   _songs: []
 }
**/
```
```js
console.log(JSON.stringify(album));
/**
 Output:
 {
    "id":1234,
    "name":"The Flying Eggplant",
    "artist":null,
    "songs":[]
 }
**/
```

### `options.mapFrom` & `options.mapTo`

`options.mapFrom`: use this option when the input object has a different property name than your class.

`options.mapTo`: use this option when you want a different property name when stringifying your object.

##### Example:  
```js
class Album extends BaseObject {

    _id = PropertyType.integer();
    _name = PropertyType.string({mapFrom: 'title'});
    _artist = PropertyType.object();
    _songs = PropertyType.array({mapTo: 'playlist'});
    
    ...
}
```

```js
const album = new Album({id: 1234, title: 'The Flying Eggplant'});
```

##### Outputs:

```js
console.log(album);
/**
 Output:
 Album {
   _id: 1234,
   _name: 'The Flying Eggplant',
   _artist: null,
   _songs: []
 }
**/
```
```js
console.log(JSON.stringify(album));
/**
 Output:
 {
    "id":1234,
    "name":"The Flying Eggplant",
    "artist":null,
    "playlist":[]
 }
**/
```

### `options.class`

This option is available for object and array proprties.

Use this option to ensure your property is a specific class (or an array of specific class).

```js
class Song extends BaseObject {
    ...
}
class Artist extends BaseObject {
    ...
}
class Album extends BaseObject {

    _id = PropertyType.integer();
    _name = PropertyType.string();
    _artist = PropertyType.object({class: Artist});
    _songs = PropertyType.array({class: Song});
    
    ...
}
```

```js
const album = new Album({id: 1234, name: 'The Flying Eggplant'});
```

##### Outputs:

```js
console.log(album);
/**
 Output:
 Album {
   _id: 1234,
   _name: 'The Flying Eggplant',
   _artist: Artist {},
   _songs: []
 }
**/
```
```js
console.log(JSON.stringify(album));
/**
 Output:
 {
    "id":1234,
    "name":"The Flying Eggplant",
    "artist":{},
    "songs":[]
 }
**/
```

### `options.def`

Define default values for undefined or misstyped properties
Default values if not specified (and `options.deleteIfUndefined` is not true): 

Type | Default Value
--- | ---
Integer  | 0
Float  | 0.0
Boolean | false
String | null
Object | null
Array | []

##### Example

```js
_description = PropertyType.string({def: 'This item has no description'});
```

##### Output:

```js
const album = new Album({id: 1234, name: 'The Flying Eggplant'});
console.log(JSON.stringify(album));
/**
 Output:
 {
    "id":1234,
    "name":"The Flying Eggplant",
    "description": "This item has no description",
    "artist":{},
    "songs":[]
 }
**/
```

### `options.deleteIfUndefined`

If set to true, delete the property if undefined (or misstyped)

##### Example 

```js
_description = PropertyType.string({deleteIfUndefined: true});
```

##### Output:

```js
const album = new Album({id: 1234, name: 'The Flying Eggplant'});
console.log(JSON.stringify(album));
/**
 Output:
 {
    "id":1234,
    "name":"The Flying Eggplant",
    "artist":{},
    "songs":[]
 }
**/
```

## Full Example

Let's say you have this JSON that represents a product:

```json
{
  "id": 123456,
  "product_name": "Acme headphones",
  "price": 289.99,
  "in_stock": true,
  "description": null,
  "seller": {
    "name": "Acme Industries",
    "email": "acme@mail.com"
  },
  "images": [
    {
      "height": 640,
      "width": 640,
      "title": "some title",
      "url": "https://some.url.to.image"
    },
    {
      "height": 640,
      "width": 640,
      "url": "https://some.url.to.image"
    }
  ]
}
```

The product object has some primitive members, a seller object and an array of image objects.

We can model it to 3 classes:

1. Seller
    ```js
    class Seller extends BaseObject {
    
        _name = PropertyType.string();
        _email = PropertyType.string();
    
        constructor(json) {
            super(json);
            this.build();
        }
    }
    ```

2. Image
    ```js
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
    ```

3. Product
    ```js
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
    ```

Now you can use it
```js
const json = require('./example.json');
// method 1:
const product = new Product(json);
// method 2:
const product = Product.fromJSON(json);

console.log(JSON.stringify(product));
```

output:
```json
{
  "id": 123456,
  "productName": "Acme headphones",
  "price": 289.99,
  "inStock": true,
  "description": "This item has no description",
  "seller": {
    "name": "Acme Industries",
    "email": "acme@mail.com"
  },
  "images": [
    {
      "h": 640,
      "w": 640,
      "title": "some title",
      "url": "https://some.url.to.image"
    },
    {
      "h": 640,
      "w": 640,
      "url": "https://some.url.to.image"
    }
  ]
}


```

## What's next

CLI tool for converting your JSON files into ES6 classes.

