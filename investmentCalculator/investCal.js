// Global variable to hold the chart instance
let currentChart = null;

// --- Function to Format Numbers (Commas, 2 decimals, no symbol) ---
function formatNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) {
       return '0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}


// --- Function to Display the Chart ---
function displayChart(years, userBalances, baselineBalances, savingsOnlyBalances, investmentOnlyBalances) {
    const chartContainer = document.getElementById('chartContainer');
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const ctx = document.getElementById('roiChartCanvas').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    chartPlaceholder.style.display = 'none'; // Hide placeholder
    chartContainer.style.display = 'block'; // Show chart container

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                 { // 1. User's Scenario (Primary)
                    label: 'Your Scenario',
                    data: userBalances,
                    borderColor: 'rgb(0, 123, 255)', // Bootstrap Primary Blue
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.1, fill: true, order: 1, pointRadius: 2, pointHitRadius: 10
                },
                { // 4. Investment Only (With ROI, No Increase) - Consistent order
                    label: 'Investment Only (No Increase)',
                    data: investmentOnlyBalances,
                    borderColor: 'rgb(108, 117, 125)', // Bootstrap Secondary Grey
                    tension: 0.1, fill: false, order: 2, pointRadius: 2, pointHitRadius: 10
                },
                { // 3. Savings Only (0% ROI, With Increase)
                    label: 'Savings Only (w/ Increase)',
                    data: savingsOnlyBalances,
                    borderColor: 'rgb(255, 193, 7)', // Bootstrap Warning Yellow/Orange
                    tension: 0.1, fill: false, order: 3, pointRadius: 2, pointHitRadius: 10
                },
                { // 2. Baseline (0% ROI, 0% Increase)
                    label: 'Baseline (Contribution Only)',
                    data: baselineBalances,
                    borderColor: 'rgb(220, 53, 69)', // Bootstrap Danger Red
                    borderDash: [5, 5],
                    tension: 0.1, fill: false, order: 4, pointRadius: 2, pointHitRadius: 10
                }
            ]
        },
        options: { // Keep options from previous version
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Ending Balance' }, ticks: { callback: value => formatNumber(value) } },
                x: { title: { display: true, text: 'Year' } }
            },
            plugins: {
                title: { display: true, text: 'Investment Growth Comparison' },
                tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatNumber(context.parsed.y)}` } },
                legend: { display: true, position: 'top' }
            }
        }
    });
}

// --- Function to Hide Results & Show Placeholders ---
function hideResults() {
     const chartContainer = document.getElementById('chartContainer');
     const tableContainer = document.getElementById('roiTableContainer');
     const chartPlaceholder = document.getElementById('chartPlaceholder');
     const tablePlaceholder = document.getElementById('tablePlaceholder');

     if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
     chartContainer.style.display = 'none';
     tableContainer.style.display = 'none';
     if(chartPlaceholder) chartPlaceholder.style.display = 'block'; // Show placeholders
     if(tablePlaceholder) tablePlaceholder.style.display = 'block';
}


// --- Calculation logic ---
document.getElementById('calculateBtn').addEventListener('click', function() {
    // --- Get Input Elements ---
    const initialBalanceInput = document.getElementById('initialBalance');
    const monthlyInvestmentInput = document.getElementById('monthlyInvestment');
    const investmentIncreasePercentInput = document.getElementById('investmentIncreasePercent');
    const annualRoiInput = document.getElementById('roi');
    const numberOfYearsInput = document.getElementById('years');
    const tableContainer = document.getElementById('roiTableContainer');
    const tablePlaceholder = document.getElementById('tablePlaceholder'); // Get placeholder
    const errorMessageDiv = document.getElementById('error-message');

    // --- Clear Previous Results and Errors ---
    tableContainer.innerHTML = ''; // Clear only table content
    errorMessageDiv.classList.add('d-none'); // Hide error alert
    errorMessageDiv.innerHTML = ''; // Clear error text
    hideResults(); // Hide chart/table, show placeholders

    // --- Get and Parse Input Values ---
     const initialBalance = parseFloat(initialBalanceInput.value) || 0;
     const initialMonthlyInvestment = parseFloat(monthlyInvestmentInput.value) || 0;
     const investmentIncreasePercent = parseFloat(investmentIncreasePercentInput.value) || 0;
     const annualRoiPercent = parseFloat(annualRoiInput.value) || 0;
     const numberOfYears = parseInt(numberOfYearsInput.value);

    // --- Input Validation ---
     let errors = [];
      if (isNaN(initialBalance) || initialBalance < 0) { errors.push("Invalid Initial Balance."); }
      if (isNaN(initialMonthlyInvestment) || initialMonthlyInvestment < 0) { errors.push("Invalid Monthly Investment."); }
      if (isNaN(investmentIncreasePercent) || investmentIncreasePercent < 0) { errors.push("Invalid Investment Increase %."); }
      if (isNaN(annualRoiPercent)) { errors.push("Invalid Annual ROI %."); }
      if (isNaN(numberOfYears) || numberOfYears <= 0 || !Number.isInteger(numberOfYears)) { errors.push("Invalid Number of Years."); }

    if (errors.length > 0) {
        // *** Update error display for Bootstrap Alert ***
        errorMessageDiv.innerHTML = errors.join('<br>'); // Use <br> for line breaks
        errorMessageDiv.classList.remove('d-none'); // Show the alert
        hideResults();
        return;
    }
     if (numberOfYears <= 0 || !Number.isInteger(numberOfYears)) {
        hideResults();
        return;
    }

    // --- Pre-calculate factors & Prepare arrays ---
    const monthlyRoiDecimal = (annualRoiPercent / 100) / 12;
    const investmentIncreaseFactor = 1 + (investmentIncreasePercent / 100);
    let chartYears = [];
    let chartEndingBalances = [];
    let chartBaselineBalances = [];
    let chartSavingsOnlyBalances = [];
    let chartInvestmentOnlyBalances = [];

    // --- Calculation Loops for Scenarios ---
    // (Loops remain the same as your provided script)
    // 1. Baseline
    let baselineBalance = initialBalance;
    const baselineMonthlyInvestment = initialMonthlyInvestment;
    for (let y = 1; y <= numberOfYears; y++) { for (let m=1; m<=12; m++) { baselineBalance += baselineMonthlyInvestment; } chartBaselineBalances.push(parseFloat(baselineBalance.toFixed(2))); }
    // 2. Savings Only
    let savingsOnlyBalance = initialBalance;
    let currentSavingsMonthlyInvestment = initialMonthlyInvestment;
    for (let y = 1; y <= numberOfYears; y++) { if (y > 1 && investmentIncreaseFactor !== 1) { currentSavingsMonthlyInvestment = Math.round((currentSavingsMonthlyInvestment * investmentIncreaseFactor)*100)/100; } for (let m=1; m<=12; m++) { savingsOnlyBalance += currentSavingsMonthlyInvestment; } chartSavingsOnlyBalances.push(parseFloat(savingsOnlyBalance.toFixed(2))); }
    // 3. Investment Only
    let investmentOnlyBalance = initialBalance;
    const constantMonthlyInvestment = initialMonthlyInvestment;
    for (let y = 1; y <= numberOfYears; y++) { for (let m=1; m<=12; m++) { const i = investmentOnlyBalance * monthlyRoiDecimal; investmentOnlyBalance += i + constantMonthlyInvestment; } chartInvestmentOnlyBalances.push(parseFloat(investmentOnlyBalance.toFixed(2))); }

    // --- Main Calculation (User's Scenario) ---
    let currentBalance = initialBalance;
    let currentMonthlyInvestment = initialMonthlyInvestment;

    // Create table structure using Bootstrap classes
     const table = document.createElement('table');
     table.className = 'table table-striped table-bordered table-hover table-sm caption-top'; // Added caption-top
     const caption = table.createCaption(); // Add caption for context
     caption.textContent = 'Yearly Growth Details';
     caption.classList.add('text-center', 'fw-bold');

     const thead = table.createTHead(); // Use createTHead
     thead.className = 'table-light';
     const tbody = table.createTBody(); // Use createTBody
     const headerRow = thead.insertRow(); // Insert row into thead
     const headers = [ 'Year', 'Start Bal.', 'Invested', 'Interest', 'End Bal.' ]; // Abbreviated headers
     headers.forEach(headerText => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = headerText;
        th.classList.add(headerText === 'Year' ? 'text-center' : 'text-end'); // Align header text
        headerRow.appendChild(th);
     });

    // Loop for main scenario table data
    for (let year = 1; year <= numberOfYears; year++) {
        if (year > 1 && investmentIncreaseFactor !== 1) { currentMonthlyInvestment = Math.round((currentMonthlyInvestment * investmentIncreaseFactor)*100)/100; }
        const startingBalanceForYear = currentBalance;
        let totalInterestThisYear = 0;
        const totalInvestedThisYear = currentMonthlyInvestment * 12;
        for (let month = 1; month <= 12; month++) { const i = currentBalance * monthlyRoiDecimal; currentBalance += i + currentMonthlyInvestment; totalInterestThisYear += i; }
        const endingBalanceForYear = currentBalance;

        // Create table row (use insertRow for tbody)
        const dataRow = tbody.insertRow();
        // Use array and loop for cells for cleaner code
        const cellData = [
            year,
            formatNumber(startingBalanceForYear),
            formatNumber(totalInvestedThisYear),
            formatNumber(totalInterestThisYear),
            formatNumber(endingBalanceForYear)
        ];
        cellData.forEach((data, index) => {
            const cell = dataRow.insertCell();
            cell.textContent = data;
            cell.classList.add(index === 0 ? 'text-center' : 'text-end'); // Center year, right-align others
        });

        // Store chart data
        chartYears.push(year);
        chartEndingBalances.push(parseFloat(endingBalanceForYear.toFixed(2)));
    }

    // --- Display Table ---
    if(tablePlaceholder) tablePlaceholder.style.display = 'none'; // Hide placeholder
    tableContainer.appendChild(table);
    tableContainer.style.display = 'block'; // Show table container

    // --- Display Chart ---
     if (chartYears.length === numberOfYears && chartEndingBalances.length === numberOfYears && chartBaselineBalances.length === numberOfYears && chartSavingsOnlyBalances.length === numberOfYears && chartInvestmentOnlyBalances.length === numberOfYears) {
        displayChart(chartYears, chartEndingBalances, chartBaselineBalances, chartSavingsOnlyBalances, chartInvestmentOnlyBalances);
     } else {
        console.error("Mismatch in chart data array lengths or no years calculated.");
        hideResults();
     }
});