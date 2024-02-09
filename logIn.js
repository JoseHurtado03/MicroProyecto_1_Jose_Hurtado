const button = document.getElementById("startButton")
const userName1 = document.getElementById("player1")
const userName2 = document.getElementById("player2")
const userName3 = document.getElementById("player3")
const userName4 = document.getElementById("player4")
const numMatrix = document.getElementById("numMatrix")

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
        window.location.href = 'bingo.html'
    } else {
            alert("Por favor, completa todos los campos de forma correcta para continuar.")
    }
});

/*export {numMatrix}*/