Template.home.events(
{
 
 'click #btnAdd': function(){
      res = '<div><div style="display: inline-block;" width="80%">'+$("#ProductID").val()+'</div>';
      res = res + '<div width="80%" style="display: inline-block;">'+$("#ProductName").val()+'</div>';
      res = res + '<div width="80%" style="display: inline-block;">'+$("#Quantity").val()+'</div>';
      res = res + '<div width="80%" style="display: inline-block;">'+$("#Measurement").val()+'</div></div>';
      $("#Container").append(res);
      $("#ProductID").focus();
},
'keypress #ProductID': function (evt, template) {
    if (evt.which == 13) {
      $("#ProductName").focus();
    }
  },
'keypress #ProductName': function (evt, template) {
    if (evt.which == 13) {
      $("#Quantity").focus();
    }
  },
'keypress #Quantity': function (evt, template) {
    if (evt.which == 13) {
      $("#btnAdd").focus();
    }
  }
});
