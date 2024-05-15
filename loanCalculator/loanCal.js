$(document).ready(function () {
  $("#loanAmount-input").on("input", function () {
    let value = $(this).val();
    value = value.replace(/\D/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $(this).val(value);
  });

  $("#loanAmount-input").on("blur", function () {
    let value = $(this).val().replace(/,/g, "");
    if (!value || isNaN(value) || value <= 0) {
      this.setCustomValidity("Please enter a valid loan amount.");
    } else {
      this.setCustomValidity("");
    }
  });

  $("#extraPmt-input").on("input", function () {
    let value = $(this).val();
    value = value.replace(/\D/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $(this).val(value);
  });

  //   $("#extraPmt-input").on("blur", function () {
  //     let value = $(this).val().replace(/,/g, "");
  //     if (!value || isNaN(value) || value <= 0) {
  //       this.setCustomValidity("Please enter a valid loan amount.");
  //     } else {
  //       this.setCustomValidity("");
  //     }
  //   });

  (function () {
    "use strict";
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          event.preventDefault();
          event.stopPropagation();
          form.classList.add("was-validated");
          displayTextWhenClickSubmit();
        },
        false
      );
    });
  })();

  function displayTextWhenClickSubmit() {
    const loanAmount = $("#loanAmount-input").val().replace(/,/g, "");
    const interestRate = $("#interrestRate-input").val();
    const loanTermYear = $("#loanTerm-year-input").val();
    const loanTermMonth = $("#loanTerm-month-input").val();
    const extraPmt = $("#extraPmt-input").val().replace(/,/g, "");

    let PV = Number(loanAmount);
    let n = Number(loanTermMonth) + Number(loanTermYear) * 12;
    let i = Number(interestRate) / 100 / 12;
    let x = Number(extraPmt);

    let PMT = (PV * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    if (PMT) {
      pmtComma = String(Math.floor(PMT)).replace(/\D/g, "");
      pmtComma = pmtComma.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      totalPmt = String(Math.floor(PMT * n)).replace(/\D/g, "");
      totalPmt = totalPmt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      totalItr = String(Math.floor(PMT * n - PV)).replace(/\D/g, "");
      totalItr = totalItr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      annualPmt = String(Math.floor(PMT * 12)).replace(/\D/g, "");
      annualPmt = annualPmt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      $("#monthlyPmt-text").text(pmtComma);
      $("#TotalPmt-text").text(totalPmt);
      $("#totalInterrest-text").text(totalItr);
      $("#annualPmt-text").text(annualPmt);
    }
  }
});
