const switchB = document.getElementById("mainButton");
const numTurn = document.getElementById("numTurn");
const bingoNum = document.getElementById("bingoNum");
const cardSpace = document.getElementById("cardSpace");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const currentPlayer = document.getElementById("currentPlayer");

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
        /* evaluatePoints(); */
        alert("Ya has alcanzado el límite de 25 turnos.");
    }
    evaluatePoints();
});

let usedNumsByBingo = []; // Array para almacenar los números que ya han sido utilizados por la ruleta de Bingo
let usedNumsByMe = [];    // Array para almacenar los números que ya han sido utilizados en un mismo cartón de Bingo
var currentCard = 0;
const n = 5               //Tamaño nxn de las matrices

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

genBingoMatrices(n);

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
