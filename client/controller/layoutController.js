Meteor.subscribe('Stocks');
Meteor.subscribe('Sales');

Template.home.rendered = function() {
    console.log("*************************");
    $('#productId').focus();

    $('#stockSearch').val('');
    $('#saleSearch').val('');

    Session.set('stockSearchKey','');
    Session.set('saleSearchKey','');

    if(Session.get('type') == "sales") {
        showSaleContainer();
    } else {
        showStockContainer();
    }
    Session.set('type', '');
};

Template.stocks.helpers({
    'stockList': function () {
        showTotalStockPrice();
        if(Session.get('stockSearchKey') != '') {
            return Stocks.find({$or: [{"productId": {$regex: Session.get('stockSearchKey')}}, {"productName": {$regex: Session.get('stockSearchKey')}}]});
        } else {
            return Stocks.find();
        }
    },
    'stockExist' : function() {
        var stocks = Stocks.find();
        if(Session.get('stockSearchKey') != '') {
            stocks = Stocks.find({$or: [{"productId": {$regex: Session.get('stockSearchKey')}}, {"productName": {$regex: Session.get('stockSearchKey')}}]});
        }
        return (stocks.count() > 0);
    }
});

Template.sales.helpers({
    'saleList': function () {
        showTotalSale();
        if(Session.get('saleSearchKey') != '') {
            return Sales.find({$or: [{"productId": {$regex: Session.get('saleSearchKey')}}, {"productName": {$regex: Session.get('saleSearchKey')}}]});
        } else {
            return Sales.find();
        }
    },
    'saleExist' : function() {
        var sales = Sales.find();
        if(Session.get('saleSearchKey') != '') {
            sales = Sales.find({$or: [{"productId": {$regex: Session.get('saleSearchKey')}}, {"productName": {$regex: Session.get('saleSearchKey')}}]});
        }
        return (sales.count() > 0);
    }
});

Template.home.events({
    'click #stocks': showStockContainer,
    'click #sales': showSaleContainer,
    'click #allStocks': function () {
        Session.set('stockSearchKey', '');
        Session.set('type', 'stocks');
        Router.go('/');
    },
    'click #searchStocks': function () {
        searchStocks();
    },
    'click #allSales': function () {
        Session.set('saleSearchKey', '');
        Session.set('type', 'sales');
        Router.go('/');
    },
    'click #searchSales': function () {
        searchSales();
    },
    'click #addStock': addStock,
    'click #addSale': addSale
});

Template.stocks.events({
    'keydown input': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter value');
                event.target.focus();
            } else {
                if(event.target.id == "stockSearch") {
                    searchStocks();
                    return;
                }
                var stockInfo = Stocks.findOne({productId: $('#sProductId').val()});
                if(event.target.id == "productId") {
                    if(stockInfo) {
                        alert('Stock already exist. Please update');
                        $('#productId').val('');
                        return;
                    }
                }
                if(event.target.id == "productPrice") {
                    addStock();
                    return;
                }
                $(':input:eq(' + ($(':input').index(event.target) + 1) + ')').focus();
            }
        }
    }
});

Template.sales.events({
    'keydown input': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter value');
                event.target.focus();
            } else {
                if(event.target.id == "saleSearch") {
                    searchSales();
                    return;
                }
                var stockInfo = Stocks.findOne({productId: $('#sProductId').val()});
                if(event.target.id == "sProductId") {
                    $('#sProductName').val(stockInfo.productName);
                    $('#sQuantity').focus();
                    return;
                } else if(event.target.id == "sQuantity") {
                    if(stockInfo.quantity == 0) {
                        alert('No stock');
                    } else if(parseFloat($('#sQuantity').val()) > parseFloat(stockInfo.quantity)) {
                        alert('Available quantity is only '+stockInfo.quantity);
                    } else {
                        var price = (parseFloat(stockInfo.productPrice) / parseFloat(stockInfo.quantity)) * parseFloat($('#sQuantity').val());
                        $('#sProductPrice').val(price.toString());
                        $('#sUnit').val(stockInfo.unit);
                        $('#sProductPrice').focus();
                        return;
                    }
                } else if(event.target.id == "sProductPrice") {
                    addSale();
                    return;
                }
                $(':input:eq(' + ($(':input').index(event.target) + 1) + ')').focus();
                
            }
        }
    }
});

function addSale() {
    var saleInfo = {};
    saleInfo.productId = $('#sProductId').val();
    saleInfo.productName = $('#sProductName').val();
    saleInfo.productPrice = $('#sProductPrice').val();
    saleInfo.quantity = $('#sQuantity').val();
    saleInfo.unit = $('#sUnit').val();
    var totalSale = Session.get('totalSale') + parseFloat(saleInfo.productPrice);
    $('#totalSale').html('<h4> Total : ' + Session.get('totalSale').toString() + '</h4>');
    Session.set('totalSale', totalSale);
    Meteor.call('insertSaleData', saleInfo);
    clearSaleFields();
}

function addStock() {
    var stockInfo = {};
    stockInfo.productId = $('#productId').val();
    stockInfo.productName = $('#productName').val();
    stockInfo.productPrice = $('#productPrice').val();
    stockInfo.quantity = $('#quantity').val();
    stockInfo.unit = $('#unit').val();
    console.log(JSON.stringify(stockInfo));
    var totalStockPrice = Session.get('totalStockPrice') + parseFloat(stockInfo.productPrice);
    $('#totalStockPrice').html('<h4> Total : ' + Session.get('totalStockPrice').toString() + '</h4>');
    Session.set('totalStockPrice', totalStockPrice);
    Meteor.call('insertStockData', stockInfo);
    clearStockFields();
}

function clearSaleFields() {
    $('#sProductId').val('');
    $('#sProductName').val('');
    $('#sProductPrice').val('');
    $('#sQuantity').val('');
    $('#sUnit').val('');
}

function clearStockFields() {
    $('#productId').val('');
    $('#productName').val('');
    $('#productPrice').val('');
    $('#quantity').val('');
    $('#unit').val('');
}

function showTotalStockPrice() {
    var stocks = Stocks.find();
    var isSearch = false;
    if(Session.get('stockSearchKey') != '') {
        isSearch = true;
        stocks = Stocks.find({$or: [{"productId": {$regex: Session.get('stockSearchKey')}}, {"productName": {$regex: Session.get('stockSearchKey')}}]});
    }
    if(stocks.count() > 0) {
        var totalStockPrice = 0.0;
        stocks.forEach(function(stock){
            totalStockPrice += parseFloat(stock.productPrice);
        });
        console.log("**************************"+totalStockPrice);
        $('#totalStockPrice').html('<h4>Total : ' + totalStockPrice.toString() + '</h4>');
        if(!isSearch) {
            Session.set('totalStockPrice', totalStockPrice);
        }
    } else {
        if(!isSearch) {
            Session.set('totalStockPrice', 0.0);
        }
    }
}

function showTotalSale() {
    var sales = Sales.find();
    var isSearch = false;
    if(Session.get('saleSearchKey') != '') {
        isSearch = true;
        sales = Sales.find({$or: [{"productId": {$regex: Session.get('saleSearchKey')}}, {"productName": {$regex: Session.get('saleSearchKey')}}]});
    }
    if(sales.count() > 0) {
        var totalSale = 0.0;
        sales.forEach(function(sale){
            totalSale += parseFloat(sale.productPrice);
        });
        console.log("**************************"+totalSale);
        $('#totalSale').html('<h4>Total : ' + totalSale.toString() + '</h4>');
        if(!isSearch) {
            Session.set('totalSale', totalSale);
        }
    } else {
        if(!isSearch) {
            Session.set('totalSale', 0.0);
        }
    }
}

function searchStocks() {
    Session.set('stockSearchKey', $('#stockSearch').val());
    Session.set('type', 'stocks');
    Router.go('/');
}

function searchSales() {
    Session.set('saleSearchKey', $('#saleSearch').val());
    Session.set('type', 'sales');
    Router.go('/');
}

function showStockContainer() {
    $('#salesContainer').css('display', 'none');
    $('#stocksContainer').css('display', 'block');
    $('#stocks').removeClass('button');
    $('#stocks').addClass('button-selection');
    $('#sales').removeClass('button-selection');
    $('#sales').addClass('button');
    $('#productId').focus();
    showTotalStockPrice();
}

function showSaleContainer() {
    $('#stocksContainer').css('display', 'none'); 
    $('#salesContainer').css('display', 'block');
    $('#sales').removeClass('button');
    $('#sales').addClass('button-selection');
    $('#stocks').removeClass('button-selection');
    $('#stocks').addClass('button');
    $('#sProductId').focus();
    showTotalSale();
}