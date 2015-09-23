Meteor.publish('Sales', function () {
    return Sales.find();
});


//Define all the methods interact with the STOCKS object
Meteor.methods({

    'insertSaleData': function (saleInfo) {
        Sales.insert(saleInfo);      
    },

    'deleteSaleData': function (selectedSale) {
        
    },

    'updateSaleData': function (selectedSale, saleInfo) {
        Sales.update(selectedSale, {$set: saleInfo});
    }
});