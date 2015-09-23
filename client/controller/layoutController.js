Meteor.subscribe('Stocks');
Meteor.subscribe('Sales');

Template.home.events({
    'click #stocks': function () {
        $('#salesContainer').css('display', 'none');
        $('#stocksContainer').css('display', 'block');
        $('#productId').focus();
    },
    'click #sales': function () {
        $('#stocksContainer').css('display', 'none'); 
        $('#salesContainer').css('display', 'block');
        $('#sProductId').focus();
    },
    'click #addStock': addStock,
    'click #addSale': addSale,
    'keydown input': function (event) {
      if(event.which === 13) {
        console.log($('#'+event.target.id).val());
          if($('#'+event.target.id).val() == '') {
              alert('Enter value');
              event.target.focus();
          } else {
              if(event.target.id == "productPrice") {
                  addStock();
                  return;
              }
              if(event.target.id == "sQuantity") {
                  var stockInfo = Stocks.findOne({productId: $('#sProductId').val()});
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

Template.home.rendered = function() {
  $('#productId').focus();
  var sales = Sales.find();
  var stocks = Stocks.find();
  if(sales.count() > 0) {
    var totalSale = 0.0;
    var totalStockPrice = 0.0;
      sales.forEach(function(sale){
          totalSale += parseFloat(sale.productPrice);
      });
      console.log("**************************"+totalSale);
      $('#totalSale').html('<h4>Total : ' + totalSale.toString() + '</h4>');
      Session.set('totalSale', totalSale);
      stocks.forEach(function(stock){
          totalStockPrice += parseFloat(stock.productPrice);
      });
      console.log("**************************"+totalStockPrice);
      $('#totalStockPrice').html('<h4>Total : ' + totalStockPrice.toString() + '</h4>');
      Session.set('totalStockPrice', totalStockPrice);
  } else {
      Session.set('totalStockPrice', 0.0);
  }
};

Template.stocks.helpers({
    'stockList': function () {
        return Stocks.find();
    }
});

Template.sales.helpers({
    'saleList': function () {
        return Sales.find();
    }
});

Template.home.helpers({
    'stockList': function () {
        return Stocks.find();
    },
    'saleList': function () {
        return Sales.find();
    }
});

function addSale() {
  console.log("*******************add");
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
}

function addStock() {
    var stockInfo = {};
    stockInfo.productId = $('#productId').val();
    stockInfo.productName = $('#productName').val();
    stockInfo.productPrice = $('#productPrice').val();
    stockInfo.quantity = $('#quantity').val();
    stockInfo.unit = $('#unit').val();
    console.log(JSON.stringify(stockInfo));
    var totalStockPrice = Session.get('totalStockPrice') + parseFloat(saleInfo.productPrice);
    $('#totalStockPrice').html('<h4> Total : ' + Session.get('totalStockPrice').toString() + '</h4>');
    Session.set('totalStockPrice', totalStockPrice);
    Meteor.call('insertStockData', stockInfo);
}