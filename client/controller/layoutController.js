Meteor.subscribe('Stocks');
Meteor.subscribe('Sales');

productList = [];

Template.home.rendered = function() {
    console.log("**********rendered************");
    console.log("*************************"+productList.length);
    $('#productId').focus();

    $('#stockSearch').val('');
    $('#saleSearch').val('');

    Session.set('stockSearchKey','');
    Session.set('saleSearchKey','');
    console.log("*************************"+Session.get('type'));
    if(Session.get('type') == "billing") {
        showBillingContainer();
    } else if(Session.get('type') == "sales") {
        showSaleContainer();
    } else {
        console.log("**********else***************");
        showStockContainer();
    }
    Session.set('type', '');
};

Template.stocks.helpers({
    'stockExist' : function() {
        var stocks = Stocks.find();
        if(Session.get('stockSearchKey') != '') {
            stocks = Stocks.find({$or: [{"productId": {$regex: Session.get('stockSearchKey')}}, {"productName": {$regex: Session.get('stockSearchKey')}}]});
        }
        return (stocks.count() > 0);
    },
    'stockList': function () {
        showTotalStockPrice();
        if(Session.get('stockSearchKey') != '') {
            return Stocks.find({$or: [{"productId": {$regex: Session.get('stockSearchKey')}}, {"productName": {$regex: Session.get('stockSearchKey')}}]});
        } else {
            return Stocks.find();
        }
    }
});

Template.sales.helpers({
    'saleExist' : function() {
        var sales = Sales.find();
        if(Session.get('saleSearchKey') != '') {
            sales = Sales.find({$or: [{"productId": {$regex: Session.get('saleSearchKey')}}, {"productName": {$regex: Session.get('saleSearchKey')}}]});
        }
        return (sales.count() > 0);
    },
    'saleList': function () {
        showTotalSale();
        if(Session.get('saleSearchKey') != '') {
            return Sales.find({$or: [{"productId": {$regex: Session.get('saleSearchKey')}}, {"productName": {$regex: Session.get('saleSearchKey')}}]});
        } else {
            return Sales.find();
        }
    }
});

Template.billing.helpers({
    productList : function() {
        return Session.get('productList');
    }
});

Template.home.events({
    'click #stocks': showStockContainer,
    'click #sales': showSaleContainer,
    'click #billing': showBillingContainer,
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
    'click #addSale': addSale,
    'click #addProduct': addProduct,
    'click #newBilling': newBilling,
    'click .update-stock-link': function(event) {
        updateStockFields(event);
    },
    'click .delete-stock-link': function(event) {
        deleteStock(event);
    },
    'click .update-btn': function(event) {
        updateStock(event);
    }
});

Template.stocks.events({
    'keydown input[type="search"]': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter search value');
                event.target.focus();
            } 
            searchStocks();
        }
    },
    'keydown input[type="text"]': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter value');
                event.target.focus();
            } else {
                var stockInfo = Stocks.findOne({productId: {$regex: $('#productId').val()}});
                if(event.target.id == "productId") {
                    if(stockInfo) {
                        alert('Product already exist in stock. Please update');
                        $('#productId').val('');
                        return;
                    }
                }
                if(event.target.id == "quantity") {
                    $('#productPrice').focus();
                    return;
                }
                if(event.target.id == "productPrice") {
                    addStock();
                    return;
                }
                $(':input:eq(' + ($(':input').index(event.target) + 1) + ')').focus();
            }
        }
    },
    'keydown input[type="number"]': function (event) {
        console.log("************"+event.which+"....."+String.fromCharCode(event.which));
        if (isNaN(String.fromCharCode(event.which)) && event.which != 13 && event.which != 8 && event.which != 190) {
            return false;
        }
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter value');
                event.target.focus();
            } else {
                var stockInfo = Stocks.findOne({productId: {$regex: $('#productId').val()}});
                
                if(event.target.id == "quantity") {
                    $('#productPrice').focus();
                    return;
                }
                if(event.target.id == "productPrice") {
                    addStock();
                    return;
                }
                $(':input:eq(' + ($(':input').index(event.target) + 1) + ')').focus();
            }
        }
    },
    'change #selectUnit': function(event) {
        $('#productPrice').focus();
    }
});

Template.sales.events({
    'keydown input[type="search"]': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter search value');
                event.target.focus();
            } 
            searchSales();
        }
    },
    'keydown input': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter value');
                event.target.focus();
            } else {
                //var stockInfo = Stocks.findOne({productId: $('#sProductId').val()});
                var stockInfo = Stocks.findOne({productId: {$regex: $('#sProductId').val()}})
                if(event.target.id == "sProductId") {
                    $('#sProductName').val(stockInfo.productName);
                    $('#sQuantity').focus();
                    return;
                } else if(event.target.id == "sQuantity") {
                    var price = (parseFloat(stockInfo.productPrice) / parseFloat(stockInfo.quantity)) * parseFloat($('#sQuantity').val());
                    $('#sProductPrice').val(price.toString());
                    $('#sSelectUnit').val(stockInfo.unit.value);
                    $('#sProductPrice').focus();
                    return;
                } else if(event.target.id == "sSoldPrice") {
                    addSale();
                    return;
                }
                $(':input:eq(' + ($(':input').index(event.target) + 1) + ')').focus();
                
            }
        }
    },
    'change #sSelectUnit': function(event) {
        $('#sProductPrice').focus();
    }
});

Template.billing.events({
    'keydown input': function (event) {
        if(event.which === 13) {
            console.log($('#'+event.target.id).val());
            if($('#'+event.target.id).val() == '') {
                alert('Enter value');
                event.target.focus();
            } else {
                var stockInfo = Stocks.findOne({productId: {$regex: $('#bProductId').val()}});
                if(event.target.id == "bProductId") {
                    if(!stockInfo || (stockInfo && stockInfo.quantity == 0)) {
                        alert('Stock not available');
                        return;
                    }
                    $('#bProductName').val(stockInfo.productName);
                    $('#bQuantity').focus();
                    return;
                } else if(event.target.id == "bQuantity") {
                    if(parseFloat($('#bQuantity').val()) > parseFloat(stockInfo.quantity) && stockInfo.unit.value == $("#bSelectUnit option:selected").val()) {
                        alert('Available quantity is only '+stockInfo.quantity+ ' '+stockInfo.unit.text);
                    } else {
                        var price = parseFloat(stockInfo.productPrice) / parseFloat(stockInfo.quantity);
                        if($("#bSelectUnit option:selected").val() == 'mg') {
                            price =  price * parseFloat($('#bQuantity').val()) / 1000;
                        } else {
                            price =  price * parseFloat($('#bQuantity').val());
                        }
                        $('#bProductPrice').val(price.toString());
                        if(parseFloat($('#bQuantity').val()) < parseFloat(stockInfo.quantity)) {
                            $('#bSelectUnit').val(stockInfo.unit.value);
                        }
                        $('#bProductPrice').focus();
                        return;
                    }
                } else if(event.target.id == "bProductPrice") {
                    addProduct();
                    return;
                }
                $(':input:eq(' + ($(':input').index(event.target) + 1) + ')').focus();
                
            }
        }
    },
    'change #bSelectUnit': function(event) {
        var stockInfo = Stocks.findOne({productId: {$regex: $('#bProductId').val()}});
        var price = parseFloat(stockInfo.productPrice) / parseFloat(stockInfo.quantity);
        console.log("******************"+price);
        if($("#bSelectUnit option:selected").val() == 'mg') {
            price =  price * parseFloat($('#bQuantity').val()) / 1000;
        } else {
            if(parseFloat($('#bQuantity').val()) > parseFloat(stockInfo.quantity)) {
                alert('Available quantity is only '+stockInfo.quantity+ ' '+stockInfo.unit.text);
                $('#bSelectUnit').val('mg');
                return;
            }
            price =  price * parseFloat($('#bQuantity').val());
        }
        console.log("******************"+price);
        $('#bProductPrice').val(price.toString());
        $('#bProductPrice').focus();
    }
});

function addSale() {
    if($('#sProductId').val() == '' || $('#sProductName').val() == '' || $('#sProductPrice').val() == '' || $('#sSoldPrice').val() == '' || $('#sQuantity').val() == '') {
        alert('Enter value');
        return;
    }
    var stockInfo = Stocks.findOne({productId: {$regex: $('#productId').val()}});
    if(!stockInfo) {
        alert('Product is not available');
        return;
    }
    var saleInfo = {};
    saleInfo.productId = $('#sProductId').val();
    saleInfo.productName = $('#sProductName').val();
    saleInfo.productPrice = $('#sProductPrice').val();
    saleInfo.soldPrice = $('#sSoldPrice').val();
    saleInfo.quantity = $('#sQuantity').val();
    saleInfo.unit = {"text": $("#selectUnit option:selected").text(), "value": $("#selectUnit option:selected").val()};
    var totalSale = Session.get('totalSale') + parseFloat(saleInfo.productPrice);
    var totalSoldPrice = Session.get('totalSoldPrice') + parseFloat(saleInfo.soldPrice);
    $('#totalSoldPrice').text('Total : '+ Session.get('totalSoldPrice').toString());
    Session.set('totalSale', totalSale);
    Session.set('totalSoldPrice', totalSoldPrice);
    Meteor.call('insertSaleData', saleInfo);
    clearSaleFields();
}

function addStock() {
    if($('#productId').val() == '' || $('#productName').val() == '' || $('#productPrice').val() == '' || $('#puantity').val() == '') {
        alert('Enter value');
        return;
    }
    var stockInfo = Stocks.findOne({productId: {$regex: $('#productId').val()}});
    if(stockInfo) {
        alert('Product already exist in stock. Please update');
        $('#productId').val('');
        return;
    }
    var stockInfo = {};
    stockInfo.productId = $('#productId').val();
    stockInfo.productName = $('#productName').val();
    stockInfo.productPrice = $('#productPrice').val();
    stockInfo.quantity = $('#quantity').val();
    stockInfo.unit = {"text": $("#sSelectUnit option:selected").text(), "value": $("#sSelectUnit option:selected").val()};
    console.log(JSON.stringify(stockInfo));
    var totalStockPrice = Session.get('totalStockPrice') + parseFloat(stockInfo.productPrice);
    $('#totalStockPrice').html('<h4> Total : ' + Session.get('totalStockPrice').toString() + '</h4>');
    Session.set('totalStockPrice', totalStockPrice);
    Meteor.call('insertStockData', stockInfo);
    clearStockFields();
}

function addProduct() {
    if($('#bProductId').val() == '' || $('#bProductName').val() == '' || $('#bProductPrice').val() == '' || $('#bQuantity').val() == '') {
        alert('Enter value');
        return;
    }
    var stockInfo = Stocks.findOne({productId: {$regex: $('#bProductId').val()}});
    var productInfo = {};
    productInfo.productId = $('#bProductId').val();
    productInfo.productName = $('#bProductName').val();
    productInfo.productPrice = parseFloat(stockInfo.productPrice) / parseFloat(stockInfo.quantity) ;
    productInfo.soldPrice = $('#bProductPrice').val();
    productInfo.quantity = $('#bQuantity').val();
    productInfo.unit = {"text": $("#bSelectUnit option:selected").text(), "value": $("#bSelectUnit option:selected").val()};
    productList.push(productInfo);
    Session.set('productList', productList);
    Session.set('type', 'billing');
    showTotalProductPrice();
    clearProductFields();
    Meteor.call('insertSaleData', productInfo);
    var quantity = 0;
    if($("#bSelectUnit option:selected").val() == 'mg') {
        quantity =  parseFloat(stockInfo.quantity) - (parseFloat(productInfo.quantity)/1000);
    } else {
        quantity = parseFloat(stockInfo.quantity) - parseFloat(productInfo.quantity);
    }
    Meteor.call('updateStockData', {productId: {$regex: $('#bProductId').val()}}, {quantity: quantity});
    Router.go('/');
}

function clearSaleFields() {
    $('#sProductId').val('');
    $('#sProductName').val('');
    $('#sProductPrice').val('');
    $('#sSoldPrice').val('');
    $('#sQuantity').val('');
    $('#sProductId').focus();
}

function clearStockFields() {
    $('#productId').val('');
    $('#productName').val('');
    $('#productPrice').val('');
    $('#quantity').val('');
    $('#unit').val('');
    $('#productId').focus();
}

function clearProductFields() {
    $('#bProductId').val('');
    $('#bProductName').val('');
    $('#bProductPrice').val('');
    $('#bQuantity').val('');
    $('#bProductId').focus();
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
        var totalSoldPrice = 0.0;
        sales.forEach(function(sale){
            totalSale += parseFloat(sale.productPrice);
            totalSoldPrice += parseFloat(sale.soldPrice);
        });
        var profit = totalSoldPrice - totalSale;
        console.log();
        $('#totalSoldPrice').text('Total : '+ totalSoldPrice.toString());
        $('#saleProfit').text('Profit : '+ profit.toString());
        if(!isSearch) {
            Session.set('totalSale', totalSale);
            Session.set('totalSoldPrice', totalSoldPrice);
        }
    } else {
        if(!isSearch) {
            Session.set('totalSale', 0.0);
            Session.set('totalSoldPrice', 0.0);
        }
    }
}

function showTotalProductPrice() {
    var totalProductPrice = 0.0;
    var pList = Session.get('productList');
    for(var i = 0; i < pList.length; i++) {
        totalProductPrice += parseFloat(pList[i].soldPrice);
    }
    $('#totalProductPrice').html('<h4>Total : ' + totalProductPrice.toString() + '</h4>');
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
    $('#billingContainer').css('display', 'none');
    $('#salesContainer').css('display', 'none');
    $('#stocksContainer').css('display', 'block');
    $('#stocks').removeClass('button');
    $('#stocks').addClass('button-selection');
    $('#sales').removeClass('button-selection');
    $('#sales').addClass('button');
    $('#billing').addClass('button');
    $('#billing').removeClass('button-selection');
    $('#productId').focus();
    Session.set('type', 'stocks');
    showTotalStockPrice();
}

function showSaleContainer() {
    $('#billingContainer').css('display', 'none');
    $('#stocksContainer').css('display', 'none'); 
    $('#salesContainer').css('display', 'block');
    $('#sales').removeClass('button');
    $('#sales').addClass('button-selection');
    $('#stocks').removeClass('button-selection');
    $('#stocks').addClass('button');
    $('#billing').addClass('button');
    $('#billing').removeClass('button-selection');
    $('#sProductId').focus();
    Session.set('type', 'sales');
    showTotalSale();
}

function showBillingContainer() {
    $('#stocksContainer').css('display', 'none'); 
    $('#salesContainer').css('display', 'none');
    $('#billingContainer').css('display', 'block');
    $('#billing').removeClass('button');
    $('#billing').addClass('button-selection');
    $('#sales').removeClass('button-selection');
    $('#sales').addClass('button');
    $('#stocks').removeClass('button-selection');
    $('#stocks').addClass('button');
    $('#bProductId').focus();
    Session.set('type', 'billing');
}

function newBilling(){
    clearProductFields();
    productList = [];
    Session.set('productList',[]);
    showTotalProductPrice();
    Router.go('/');
}

function updateStockFields(event) {
    var id = event.target.id.toString().replace('updateStockFields','');
    $('#stockTable'+id).css("display", "none");
    $('#stockUpdateTable'+id).css("display", "table");
}

function updateStock(event) {
    var id = event.target.id.toString().replace('updateStock','');
    var updateStockInfo = {};
    updateStockInfo.quantity = $('#quantity'+id).val();
    updateStockInfo.unit = {"text": $('#selectUnit'+id+' option:selected').text(), "value": $('#selectUnit'+id+' option:selected').val()};
    updateStockInfo.productPrice = $('#productPrice'+id).val();
    Meteor.call('updateStockData', {productId:{$regex: id}}, updateStockInfo);
    $('#stockTable'+id).css("display", "table");
    $('#stockUpdateTable'+id).css("display", "none");
    //Router.go('/');
}

function deleteStock(event) {
    var id = event.target.id.toString().replace('deleteStock','');
    Meteor.call('deleteStockData', {productId: {$regex: id}});
}