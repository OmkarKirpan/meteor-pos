Meteor.publish('Stocks', function () {
    return Stocks.find();
});


//Define all the methods interact with the STOCKS object
Meteor.methods({

    'insertStockData': function (stockInfo) {
        Stocks.insert(stockInfo);      
    },

    'deleteStockData': function (selectQuery) {
        Stocks.remove(selectQuery);
    },

    'updateStockData': function (selectQuery, stockInfo) {
        Stocks.update(selectQuery, {$set: stockInfo});
    }
});