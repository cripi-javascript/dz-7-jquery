Modernizr.load({
  test: Modernizr.inputtypes.date,
  nope: function () {
    $("input[type='date']").datepicker();
    }
  });