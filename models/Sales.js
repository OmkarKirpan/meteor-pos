// Commented by Leo Matthew.S
// 20-Jul-2015
// Use "orion generate model" to create new models
// ...
// Also creates files in server/publications

Sales = new Mongo.Collection('Sales');

Sales.attachSchema(
    new SimpleSchema({
        productId: {
            type: String
        },
        productName: {
            type: String
        },
        productPrice: {
            type: String
        },
        soldPrice: {
            type: String
        },
        quantity: {
            type: String
        },
        unit: {
            type: Object
        },
        'unit.text': {
            type: String
        },
        'unit.value': {
            type: String
        }
    })
);
