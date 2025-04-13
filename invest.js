const investAmountBox = document.getElementById("invest-amount");
//const investAmountRaw = +investAmountBox.value;
const investAmount = getCleanNumber(investAmountBox);

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
formatNumberInput(investAmountBox);

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

  const interestAEBox = document.getElementById("interest-rateAE");
  const interestAE = interestAEBox.value/100;
  const investmentMonthsBox = document.getElementById("years");
  const investmentMonths = investmentMonthsBox.value;
  const days = investmentMonths*30;
  const loanMonthsBox = document.getElementById("days");
  loanMonthsBox.value = days;
  const interestDE = (Math.pow((1+interestAE),(1/365))-1);

  const dailyInterestBox = document.getElementById("interest-rateDE");
  dailyInterestBox.value = (interestDE*100).toFixed(2);

  //const installmentBox = document.getElementById("installment");
  const withholdBox = document.getElementById("withhold");
  const dailyTopBox = document.getElementById("daily-top");


  const rowsNumber = days;
  var balance = investAmount;
  var interestAmount;
  var deposit=0;
  var totalInstallments=days;
  var totalInterest=0;
  var totalDeposit=0;
  // Obtener la referencia del elemento body: not body, section better
  const pageSection = document.getElementsByTagName("section")[0]; //bc I want to insert the table in the section

  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var headersRow  = document.createElement("tr");  // creates the first row
  fillRow("Día #", "Capital del día ($)", "Rendimientos del día ($)", "Rendimiento acumulado ($)", "Capital resultante ($)", headersRow);

  // agrega la row al final de la tabla (al final del elemento tblbody)
  tblBody.appendChild(headersRow);

  // crea un array vacio:

  let data = [];
  
    // Crea las celdas de numeros 
  for (var i = 0; i <= rowsNumber; i++) {
    var row = document.createElement("tr");  //creates the first data row
    if (i==0){
      const bal = new Intl.NumberFormat('es-MX').format(balance.toFixed(2));
      fillRow(`Día ${i}`, "--","--","--", bal, row);
    }
    else{
      interestAmount = interestDE * balance;
      totalInterest += interestAmount;
      totalDeposit+= deposit;
      
      const c1 = new Intl.NumberFormat('es-MX').format(balance.toFixed(2));
      const c2 = new Intl.NumberFormat('es-MX').format(interestAmount.toFixed(2));
      const c3 = new Intl.NumberFormat('es-MX').format(totalInterest.toFixed(2));
      balance += interestAmount;
      const c4 = new Intl.NumberFormat('es-MX').format(Math.abs(balance.toFixed(2)) );
      

      fillRow(`Día ${i}`,c1,c2,c3,c4, row);

      // agrega la data del mes para grafico:
      data.push({interes: interestAmount, abono: deposit});
    }
  // agrega la nueva row al final de la tabla (al final del elemento tblbody)
  tblBody.appendChild(row);
  }
  const t1 = "Rendimiento total:"
  const t2 = new Intl.NumberFormat('es-MX').format(totalInterest.toFixed(2));
  const t3 = "Saldo final:";
  const t4 = new Intl.NumberFormat('es-MX').format(balance.toFixed(2));

  var totalsRow = document.createElement("tr");  //creates the last/totals row
  fillRow(`${investmentMonths} meses`,t1,t2,t3,t4, totalsRow);
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