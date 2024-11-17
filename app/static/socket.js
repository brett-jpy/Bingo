// ###################
// Socket IO Functions
// ###################
const socket = io();

// Gets Session Username
let username = $('#username').data();

// Sends connection message
socket.on("connect", () => {
    socket.emit('client_username', {message: username});
});

// Receives the "ack_check_in" message back from the server
socket.on("ack_check_in", (message) => { 
    console.log(message)
    if(document.getElementById(message.username.name) != null) {
        let count = document.getElementById(message.username.name + "_cnt").innerHTML;
        let cnt = Number(count)
        console.log(cnt++)
        document.getElementById(message.username.name + "_cnt").innerHTML = cnt++;
    } else {
        let count = 1;
        let table = document.getElementById("table-id");
        var row = table.insertRow(-1); 
        let cell1 = row.insertCell(0);
        cell1.setAttribute("id", `${message.username.name}`)
        let cell2 = row.insertCell(1);
        cell2.setAttribute("id", `${message.username.name}_cnt`)
        cell1.innerHTML = `${message.username.name}`;
        let cnt = Number(count)
        cell2.innerHTML = cnt;
    }
});

// Receives the "winner" message back from the server
socket.on("finalist", (message) => { 
    console.log(message)
    document.getElementById("alert-message").innerHTML = message.name;
    document.getElementById("win-alert").classList.remove("win-alert");
});

// ###################
// Bingo Functions
// ###################

const table = document.querySelector("#tblBingo")

const winningPositions = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], // I added the two last lines to support diagnal win conditions
    [4, 8, 12, 16, 20]
]

// My funciton - gets random elements from array
// https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

// My term list
let myTerms = ["word", "list", "here"]

let bingoTerms = getRandom(myTerms, 26)

let iterator = 0;

for (i = 0; i < 5; i++) {
    let tr = document.createElement("tr")
    table.appendChild(tr)

    for (j = 0; j < 5; j++) {
        let td = document.createElement("td")
        td.id = bingoTerms[iterator].toString() 
        td.style.height = "15vh"
        td.classList.add("main-table-cell") // Class needed for click interactions to work
        td.classList.add("col-2")

        let div = document.createElement("div")
        div.classList.add("cell-format")
        div.textContent = bingoTerms[iterator].toString() 
        td.appendChild(div)
        tr.appendChild(td)
        iterator++;
    }
}

const cell = document.querySelectorAll(".main-table-cell");
let winningIterator = 0
cell.forEach(e => {
    e.addEventListener("click", () => {
        e.classList.add("strickout");
        // Report a click
        socket.emit('check_in', {"marked": e.innerText, "username": username})
        console.log(e.innerText)

        if(matchWin()) {

            winningIterator++;
            if(winningIterator === 1) {
                socket.emit('winner', {"username": $('#username').data()})
            }
        }
    })
})

function matchWin() {
    const cell = document.querySelectorAll(".main-table-cell");

    return winningPositions.some(combination => {
        let ite = 0;
        combination.forEach(index => {
            if(cell[index].classList.contains("strickout")) ite++;
        })

        if(ite === 5) {
            let indexWin = winningPositions.indexOf(combination);
            winningPositions.splice(indexWin, 1)
        }

        return combination.every(index => {
            return cell[index].classList.contains("strickout")
        })
    })
}


