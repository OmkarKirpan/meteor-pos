Meteor.publish('Stocks', function () {
    return Stocks.find();
});


//Define all the methods interact with the STOCKS object
Meteor.methods({

    'insertStockData': function (stockInfo) {
        Stocks.insert(stockInfo);      
    },

    'deleteStockData': function (selectedStock) {
        
    },

    'updateStockData': function (selectedStock, stockInfo) {
        Stocks.update(selectedStock, {$set: stockInfo});
    }
});