/*import { numMatrix } from "./logIn.js";*/
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
        bingoNum.innerText = currentNumB
    } else {
        alert("Ya has alcanzado el límite de 25 turnos.");
    }
});

let usedNumsByBingo = []; // Array para almacenar los números que ya han sido utilizados por la ruleta de Bingo
let usedNumsByMe = [];    // Array para almacenar los números que ya han sido utilizados en un mismo cartón de Bingo
var currentCard = 0;

function genBingoNum() {
    let randomBingo;
    do {
        randomBingo = Math.floor(Math.random() * 50) + 1; // Genera un número aleatorio entre 1 y 50
    } while (usedNumsByBingo.includes(randomBingo)); // Verifica si el número generado ya ha sido utilizado
    usedNumsByBingo.push(randomBingo); // Agrega el número generado al array de números utilizados
    return randomBingo;
}

let matrices = [];
function genBingoMatrices(n) {
    cardSpace.innerHTML = "";
    // Generar y almacenar las 4 matrices de bingo
    for (let i = 0; i < 4; i++) { /*OJO con el 4, tengo dudas*/
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
    const matriz = matrices[index];
    console.log("Matriz:", matriz); // Para verificar la matriz generada en la consola
    const fragment = document.createDocumentFragment();
    const tabla = document.createElement("table");
    tabla.classList.add("bingo-table");
    // Crear filas y celdas de la tabla
    for (let i = 0; i < matriz.length; i++) {
        const fila = document.createElement("tr");
        for (let j = 0; j < matriz[i].length; j++) {
            const celda = document.createElement("td");
            celda.textContent = matriz[i][j];
            fila.appendChild(celda);
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

genBingoMatrices(5);

leftButton.addEventListener("click", function() {
    if (currentCard > 0) {
        currentCard--;
        console.log(currentCard); /*Solo para probar algo */
        currentPlayer.innerHTML = ""
        var position = currentCard+1
        currentPlayer.innerHTML = "Jugador " + (position)
        showBingoMatrix(currentCard);
    } /*else {
        alert("Ya estás en la primera matriz.");
    }*/
});

rightButton.addEventListener("click", function() {
    if (currentCard < 3) {
        currentCard++;
        currentPlayer.innerHTML = ""
        currentPlayer.innerHTML = "Jugador " + (currentCard + 1)
        showBingoMatrix(currentCard);
    } /*else {
        alert("Ya estás en la última matriz.");
    }*/
});