$(".hideAtBegining").slideUp();

$("#unitCal-button-submit-item1").click(() => {
  var unitCost = unitCalculation(".first-unit-input", ".first-price-input");
  $("#unitCost-firstItem")
    .slideDown()
    .text("Unit price cost is : " + unitCost + " $ per item");
});

$("#unitCal-button-submit-item2").click(() => {
  var unitCost = unitCalculation(".second-unit-input", ".second-price-input");
  $("#unitCost-secondItem")
    .slideDown()
    .text("Unit price cost is : " + unitCost + " $ per item");
});

$("#unit-cal-dropdown").click(function () {
  $("html, body").animate(
    {
      scrollTop: $("#unit-price-calculator-div").offset().top,
    },
    1000
  );
});

$("#unit-compare-btn").click(() => {
  var unitPirceCompareVal = unitComparison();
  var compreDisplay = $("#compare-item-box")
    .slideDown()
    .text(unitPirceCompareVal);

  compreDisplay.html(compreDisplay.html().replace(/\n/g, "<br/>"));
});

function unitCalculation(unit, price) {
  var getValue = $(price).val();
  var getUnit = $(unit).val();

  //   $(".first-price-input").text();
  var unitCost = Number(getValue) / Number(getUnit);
  console.log(unitCost);
  return unitCost.toFixed(3);
}

function unitComparison() {
  var unitCostItemOne = unitCalculation(
    ".first-unit-input",
    ".first-price-input"
  );
  var unitCostItemTwo = unitCalculation(
    ".second-unit-input",
    ".second-price-input"
  );
  var unitCompare = [""];
  if (unitCostItemOne < unitCostItemTwo) {
    return (
      "Item One : " +
      unitCostItemOne +
      " Per item" +
      "\nItem Two : " +
      unitCostItemTwo +
      " Per item" +
      "\n" +
      "Item One is Cheaper"
    );
  } else if (unitCostItemOne > unitCostItemTwo) {
    return (
      "Item One : " +
      unitCostItemOne +
      " Per item" +
      "\nItem Two : " +
      unitCostItemTwo +
      " Per item" +
      "\n" +
      "Item Two is Cheaper"
    );
  } else if (
    unitCostItemOne === unitCostItemTwo &&
    !isNaN(unitCostItemOne) &&
    !isNaN(unitCostItemTwo)
  ) {
    return (
      "Item One : " +
      unitCostItemOne +
      "\nItem Two : " +
      unitCostItemTwo +
      "\n" +
      "The Two items are the same price"
    );
  } else {
    return "Please input quantity or price";
  }
}
