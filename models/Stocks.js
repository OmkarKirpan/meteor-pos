// Commented by Leo Matthew.S
// 20-Jul-2015
// Use "orion generate model" to create new models
// ...
// Also creates files in server/publications

Stocks = new Mongo.Collection('Stocks');

Stocks.attachSchema(
    new SimpleSchema({
        productId: {
            type: String
        },
         productName: {
            type: String
        },
        productPrice: {
            type: String
        }


        /*    categoryId: {
         type: Number,
         min: 1
         },

         createdAt: {
         type: Date,
         denyUpdate: true
         }*/

    })
);
