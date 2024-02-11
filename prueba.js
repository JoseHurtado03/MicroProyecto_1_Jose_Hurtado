const button = document.getElementById("startButton")
const userName1 = document.getElementById("player1")
const userName2 = document.getElementById("player2")
const userName3 = document.getElementById("player3")
const userName4 = document.getElementById("player4")
const numMatrix = document.getElementById("numMatrix")

const switchB = document.getElementById("mainButton");
const numTurn = document.getElementById("numTurn");
const bingoNum = document.getElementById("bingoNum");
const cardSpace = document.getElementById("cardSpace");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const currentPlayer = document.getElementById("currentPlayer");
const resultTable = document.getElementById("results")
const resetB = document.getElementById("reset")

var currentPage = '';

function indexHtmlFunction() {
    function evaluateInput() {
        if (userName1.value === "" || userName2.value === "" || userName3.value === "" || userName4.value === "" || numMatrix.value === "") {
            return false; // Al menos uno de los campos está vacío
        } else {
            return true; // Todos los campos tienen valor
        }
    }
    
    function evaluateNum(str) {
            let num = parseFloat(str);
            return num > 2 && num <= 5 && !isNaN(num);
    }
    
    button.addEventListener("click", function() {
        if (evaluateInput() && evaluateNum(numMatrix.value)) {
            localStorage.setItem("player1", userName1.value)
            localStorage.setItem("player2", userName2.value)            
            localStorage.setItem("player3", userName3.value)
            localStorage.setItem("player4", userName4.value)
            localStorage.setItem("numerito", parseInt(numMatrix.value))
            window.location.href = 'bingo.html'
        } else {
            alert("Por favor, completa todos los campos de forma correcta para continuar.")
        }
    });
}

function bingoHtmlFunction() {
    switchB.addEventListener("click", function() {
        let currentTurn = parseInt(numTurn.innerText);
        let currentNumB = parseInt(bingoNum.innerText);
        if (currentTurn < 25) {
            currentTurn++;
            currentNumB = genBingoNum()
            numTurn.innerText = currentTurn;
            bingoNum.innerText = currentNumB;
            showBingoMatrix(currentCard)
        } else {
            var results = showPoints();
            resultTable.style.display = "block";
            resetB.style.display = "block"
            resultTable.innerHTML = '<h3 id="resultsTitle">Puntuaciones</h3>';
            var resultsArray = results.split('\n');
            resultsArray.forEach(function(result) {
                resultTable.innerHTML += '<p>' + result + '</p>';
            });
            alert("Ya has alcanzado el límite de 25 turnos.");
        }
        evaluatePoints();
    });

    resetB.addEventListener("click", function(){
        window.location.href = 'index.html'
    })
    
    let usedNumsByBingo = []; // Array para almacenar los números que ya han sido utilizados por la ruleta de Bingo
    let usedNumsByMe = [];    // Array para almacenar los números que ya han sido utilizados en un mismo cartón de Bingo
    var currentCard = 0;
    const n = localStorage.getItem("numerito")           //Tamaño nxn de las matrices
    
    function genBingoNum() {
        let randomBingo;
        do {
            randomBingo = Math.floor(Math.random() * 50) + 1;
        } while (usedNumsByBingo.includes(randomBingo));
        usedNumsByBingo.push(randomBingo);
        return randomBingo;
    }
    
    let matrices = [];
    function genBingoMatrices(n) {
        cardSpace.innerHTML = "";
        for (let i = 0; i < 4; i++) {
            matrices[i] = genBingoMatrix(n);
        }
        showBingoMatrix(currentCard);
    }
    
    function genBingoMatrix(n) {
        let matriz = [];
        for (let i = 0; i < n; i++) {
            matriz[i] = [];
            for (let j = 0; j < n; j++) {
                matriz[i][j] = genRandomNumToCard();
            }
        }
        usedNumsByMe.splice(0, usedNumsByMe.length)
        console.log("Matriz:", matriz);
        return matriz;
    }
    
    function showBingoMatrix(index) {
        cardSpace.innerHTML = "";
        var matriz = matrices[index];
        console.log("Matriz:", matriz); // Para verificar la matriz generada en la consola
        const fragment = document.createDocumentFragment();
        const tabla = document.createElement("table");
        tabla.classList.add("bingo-table");
        for (let i = 0; i < matriz.length; i++) {
            const fila = document.createElement("tr");
            for (let j = 0; j < matriz[i].length; j++) {
                const celda = document.createElement("td");
                celda.textContent = matriz[i][j];
                fila.appendChild(celda);
                for (let k = 0; k < usedNumsByBingo.length; k++){
                    if (matriz[i][j] === usedNumsByBingo[k]){        
                        celda.classList.add("mark");                 
                    }
                }
            }
            tabla.appendChild(fila);
        }
        fragment.appendChild(tabla);
        cardSpace.appendChild(fragment);
    }
    
    function genRandomNumToCard() {
        let numeroAleatorio;
        do {
            numeroAleatorio = Math.floor(Math.random() * 50) + 1;
        } while (usedNumsByMe.includes(numeroAleatorio));
        usedNumsByMe.push(numeroAleatorio);
        return numeroAleatorio;
    }
    
    leftButton.addEventListener("click", function() {
        if (currentCard > 0) {
            currentCard--;
            currentPlayer.innerHTML = ""
            var position = currentCard+1
            currentPlayer.innerHTML = "Jugador " + (position)
            showBingoMatrix(currentCard);
        }
    });
    
    rightButton.addEventListener("click", function() {
        if (currentCard < 3) {
            currentCard++;
            currentPlayer.innerHTML = ""
            currentPlayer.innerHTML = "Jugador " + (currentCard + 1)
            showBingoMatrix(currentCard);
        }
    });
    
    function evaluatePoints(){
        var points = [0, 0, 0, 0];
        for (var i = 0; i < 4; i++){
            var point = countColoredRows(matrices[i])           //Evalúa si hay filas coloreadas
            point += countColoredColumns(matrices[i])           //Evalúa si hay columnas coloreadas
            point += (countColoredMainDiagonal(matrices[i])*3)  //Evalúa si hay diagonales coloreadas
            point += isMatrixFullyColored(matrices[i])          //Evalúa si la matriz está completamente coloreada
            points[i]= point;
        }
        console.log(points);
        return points;
    }
    
    function countColoredRows(matrix) {
        let coloredRows = 0;
        for (let i = 0; i < matrix.length; i++) {
            let rowIsColored = true;
            for (let j = 0; j < matrix[i].length; j++) {
                if (!usedNumsByBingo.includes(matrix[i][j])) {
                    rowIsColored = false;
                    break;
                }
            }
            if (rowIsColored) {
                coloredRows++;
            }
        }
        return coloredRows;
    }
    
    function countColoredColumns(matrix) {
        let coloredColumns = 0;
        for (let j = 0; j < matrix[0].length; j++) {
            let columnIsColored = true;
            for (let i = 0; i < matrix.length; i++) {
                if (!usedNumsByBingo.includes(matrix[i][j])) {
                    columnIsColored = false;
                    break;
                }
            }
            if (columnIsColored) {
                coloredColumns++;
            }
        }
        return coloredColumns;
    }
    
    function countColoredMainDiagonal(matrix) {
        let coloredDiagonals = 0;
        let diagonalIsColored1 = true; // Para la diagonal principal de la esquina superior izquierda a la inferior derecha
        let diagonalIsColored2 = true; // Para la diagonal principal de la esquina superior derecha a la inferior izquierda
        for (let i = 0; i < matrix.length; i++) {
            if (!usedNumsByBingo.includes(matrix[i][i])) {
                diagonalIsColored1 = false;
                break;
            }
        }
        for (let i = 0; i < matrix.length; i++) {
            if (!usedNumsByBingo.includes(matrix[i][matrix.length - 1 - i])) {
                diagonalIsColored2 = false;
                break;
            }
        }
        if (diagonalIsColored1) {
            coloredDiagonals++;
        }
        if (diagonalIsColored2) {
            coloredDiagonals++;
        }
        return coloredDiagonals;
    }
    
    function isMatrixFullyColored(matrix) {
        let totalCells = matrix.length * matrix[0].length;
        let coloredCells = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (usedNumsByBingo.includes(matrix[i][j])) {
                    coloredCells++;
                }
            }
        }
        if (coloredCells === totalCells) {
            return 5;
        } else {
            return 0;
        }
    }

    function showPoints(){
        var points = evaluatePoints();
        var player1 = localStorage.getItem("player1");
        var pP1 = player1 + " " + points[0]
        var player2 = localStorage.getItem("player2");
        var pP2 = player2 + " " + points[1]
        var player3 = localStorage.getItem("player3");
        var pP3 = player3 + " " + points[2]
        var player4 = localStorage.getItem("player4");
        var pP4 = player4 + " " + points[3]
        var results = ("Las puntuaciones son:\n "+ pP1 + "\n "+pP2 + "\n "+pP3+ "\n "+pP4)
        console.log(results)
        return results;
    }
    
    function main(){
        genBingoMatrices(n);
    }
    main()
}

window.onload = function() {
    if (document.title === '¡Bingo!') {
        currentPage = 'index';
        indexHtmlFunction(); // Ejecutar funciones específicas para index.html
    } else if (document.title === 'Bingo Game') {
        currentPage = 'bingo';
        bingoHtmlFunction(); // Ejecutar funciones específicas para bingo.html
    }
}