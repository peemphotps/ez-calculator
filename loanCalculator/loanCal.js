$(document).ready(function () {
  //   Example starter JavaScript for disabling form submissions if there are invalid fields
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
