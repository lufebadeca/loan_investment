const fullAmountBox = document.getElementById("full-price");
const fullAmount = fullAmountBox.value;

var activeTable=0;

function formatNumberInput(input) {
  // Quita todo lo que no sea número
  let raw = input.value.replace(/\D/g, '');
  // Aplica formato de miles (ej: 1000000 -> 1.000.000)
  input.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getCleanNumber(input) {
  return parseInt(input.value.replace(/\./g, ''), 10);
}

//format 1 time
formatNumberInput(fullAmountBox);

function genera_tabla() {
  function fillRow(first, second, third, fourth, fifth, row){
    const rowList = [first, second, third, fourth, fifth];
    for (let index = 0; index < rowList.length; index++) { // Crea un elemento <td> y un nodo de texto, haz que el nodo
      // de texto sea el contenido de <td>, ubica el elemento <td> al final de la fila (row)     
      var cell = document.createElement("td");
      var cellText = document.createTextNode(rowList[index]);
      cell .appendChild(cellText);
      row.appendChild(cell);
    }
  }

  if(activeTable==1){
    const previousTable = document.getElementById("table1");
    previousTable.remove();
  }

  const fundedPercBox = document.getElementById("funded-percentage");
  const fundedPerc = fundedPercBox.value;

  const loanAmount = fullAmount*fundedPerc/100;
  const loanVal = new Intl.NumberFormat('es-MX').format(loanAmount.toFixed(2) );
  const loanAmountBox = document.getElementById("loan-amount");
  loanAmountBox.value = loanVal;

  const interestAEBox = document.getElementById("interest-rateAE");
  const interestAE = interestAEBox.value/100;
  const loanYearsBox = document.getElementById("years");
  const loanYears = loanYearsBox.value;
  const months = loanYears*12;
  const loanMonthsBox = document.getElementById("months");
  loanMonthsBox.value = months;
  const interestME = (Math.pow((1+interestAE),(1/12))-1);

  const monthInterestBox = document.getElementById("interest-rateME");
  monthInterestBox.value = (interestME*100).toFixed(2);
  const installment = (loanAmount * interestME ) / (1-Math.pow(1+interestME,-months));
  const installmentVal = new Intl.NumberFormat('es-MX').format(installment.toFixed(2));
  const installmentBox = document.getElementById("installment");
  installmentBox.value = installmentVal;

  const rowsNumber = months;
  var balance = loanAmount;
  var interestAmount;
  var deposit=0;
  var totalInstallments=installment*months;
  var totalInterest=0;
  var totalDeposit=0;
  // Obtener la referencia del elemento body: not body, section better
  const pageSection = document.getElementsByTagName("section")[0]; //bc I want to insert the table in the section

  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var headersRow  = document.createElement("tr");  // creates the first row
  fillRow("Cuota #", "Cuota ($)", "Aporte a interés ($)", "Aporte a la deuda ($)", "Saldo", headersRow);

  // agrega la row al final de la tabla (al final del elemento tblbody)
  tblBody.appendChild(headersRow);

  // crea un array vacio:

  let data = [];
  
    // Crea las celdas de numeros 
  for (var i = 0; i <= rowsNumber; i++) {
    var row = document.createElement("tr");  //creates the first data row
    if (i==0){
      const bal = new Intl.NumberFormat('es-MX').format(balance.toFixed(2));
      fillRow(`Mes ${i}`, "--","--","--", bal, row);
    }
    else{
      interestAmount = interestME * balance;
      totalInterest += interestAmount;
      deposit = installment-interestAmount;
      totalDeposit+= deposit;
      balance -= deposit;
      
      const c1 = new Intl.NumberFormat('es-MX').format(installment.toFixed(2));
      const c2 = new Intl.NumberFormat('es-MX').format(interestAmount.toFixed(2));
      const c3 = new Intl.NumberFormat('es-MX').format(deposit.toFixed(2));
      const c4 = new Intl.NumberFormat('es-MX').format(Math.abs(balance.toFixed(2)) );

      fillRow(`Mes ${i}`,c1,c2,c3,c4, row);

      // agrega la data del mes para grafico:
      data.push({interes: interestAmount, abono: deposit});
    }
  // agrega la row al final de la tabla (al final del elemento tblbody)
  tblBody.appendChild(row);
  }
  const t1 = new Intl.NumberFormat('es-MX').format(totalInstallments.toFixed(2));
  const t2 = new Intl.NumberFormat('es-MX').format(totalInterest.toFixed(2));
  const t3 = new Intl.NumberFormat('es-MX').format(totalDeposit.toFixed(2));

  var totalsRow = document.createElement("tr");  //creates the last/totals row
  fillRow("Total:",t1,t2,t3,"0",totalsRow);
  tblBody.appendChild(totalsRow);
  
  // posiciona el <tbody> debajo del elemento <table>
  tabla.appendChild(tblBody);
  // appends <table> into <body>
  pageSection.appendChild(tabla);
  // modifica el atributo "border" de la tabla y lo fija a "2";
  tabla.setAttribute("border", "2");
  tabla.setAttribute("id", "table1");
  activeTable=1;


  //PARTE PARA LA GRAFICA
  const svg = document.getElementById("chart");
  const chartWidth = 400;
  const chartHeight = 200;
  const barWidth = 20;
  const spacing = 5;
  const maxTotal = Math.max(...data.map(d => d.interes + d.abono));

  data.forEach((item, i) => {
    const totalHeight = chartHeight - 20;
    const x = 40 + i * (barWidth + spacing);

    // Calcular alturas proporcionadas
    const total = item.interes + item.abono;
    const interesHeight = (item.interes / maxTotal) * totalHeight;
    const abonoHeight = (item.abono / maxTotal) * totalHeight;

    const yInteres = chartHeight - interesHeight;
    const yAbono = chartHeight - interesHeight - abonoHeight;

    // Rectángulo de Abono (verde)
    const rectAbono = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectAbono.setAttribute("x", x);
    rectAbono.setAttribute("y", yAbono);
    rectAbono.setAttribute("width", barWidth);
    rectAbono.setAttribute("height", abonoHeight);
    rectAbono.setAttribute("fill", "#8cb21b");
    svg.appendChild(rectAbono);

    // Rectángulo de Interés (azul)
    const rectInteres = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectInteres.setAttribute("x", x);
    rectInteres.setAttribute("y", yInteres);
    rectInteres.setAttribute("width", barWidth);
    rectInteres.setAttribute("height", interesHeight);
    rectInteres.setAttribute("fill", "#3021eb");
    svg.appendChild(rectInteres);
  });
}