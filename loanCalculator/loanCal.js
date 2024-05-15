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

  $("#extraPmt-input").on("blur", function () {
    let value = $(this).val().replace(/,/g, "");
    if (!value || isNaN(value) || value <= 0) {
      this.setCustomValidity("Please enter a valid loan amount.");
    } else {
      this.setCustomValidity("");
    }
  });

  (function () {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
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

  //   $("#loanCal-submit-btn").click(function () {
  //     displayTextWhenClickSubmit();
  //   });

  function displayTextWhenClickSubmit() {
    const loanAmount = $("#loanAmout-input").val();
    const interestRate = $("#interrestRate-input").val();
    const loanTermYear = $("#loanTerm-year-input").val();
    const loanTermMonth = $("#loanTerm-month-input").val();
    const extraPmt = $("#extraPmt-input").val();

    let PV = Number(loanAmount);
    let n = Number(loanTermMonth) + Number(loanTermYear) * 12;
    let i = Number(interestRate) / 100 / 12;
    let x = Number(extraPmt);

    // Calculate PMT using the formula for monthly mortgage payments
    let PMT = (PV * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    if (PMT) {
      $("#monthlyPmt-text").text(`${PMT.toFixed(2)}`);
      $("#TotalPmt-text").text(`${(PMT * n).toFixed(2)}`);
      $("#totalInterrest-text").text(`${(PMT * n - PV).toFixed(2)}`);
      $("#annualPmt-text").text(`${(PMT * 12).toFixed(2)}`);
    }
  }
});
