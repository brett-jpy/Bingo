function celebrateGoodTimes(){
    tsParticles.load({
      id: "tsparticles",
      options: {
  "fullScreen": {
  "zIndex": 1
  },
  "emitters": {
  "position": {
  "x": 50,
  "y": 100
  },
  "rate": {
  "quantity": 5,
  "delay": 0.15
  }
  },
  "particles": {
  "color": {
  "value": [
    "#1E00FF",
    "#FF0061",
    "#E1FF00",
    "#00FF9E"
  ]
  },
  "move": {
  "decay": 0.05,
  "direction": "top",
  "enable": true,
  "gravity": {
    "enable": true
  },
  "outModes": {
    "top": "none",
    "default": "destroy"
  },
  "speed": {
    "min": 50,
    "max": 100
  }
  },
  "number": {
  "value": 0
  },
  "opacity": {
  "value": 1
  },
  "rotate": {
  "value": {
    "min": 0,
    "max": 360
  },
  "direction": "random",
  "animation": {
    "enable": true,
    "speed": 30
  }
  },
  "tilt": {
  "direction": "random",
  "enable": true,
  "value": {
    "min": 0,
    "max": 360
  },
  "animation": {
    "enable": true,
    "speed": 30
  }
  },
  "size": {
  "value": 3,
  "animation": {
    "enable": true,
    "startValue": "min",
    "count": 1,
    "speed": 16,
    "sync": true
  }
  },
  "roll": {
  "darken": {
    "enable": true,
    "value": 25
  },
  "enlighten": {
    "enable": true,
    "value": 25
  },
  "enable": true,
  "speed": {
    "min": 5,
    "max": 15
  }
  },
  "wobble": {
  "distance": 30,
  "enable": true,
  "speed": {
    "min": -7,
    "max": 7
  }
  },
  "shape": {
  "type": [
    "circle",
    "square"
  ],
  "options": {}
  }
  },
  "responsive": [
  {
  "maxWidth": 1024,
  "options": {
    "particles": {
      "move": {
        "speed": {
          "min": 33,
          "max": 66
        }
      }
    }
  }
  }
  ]
  }
  });
};



function notifyBingo(){
  $.ajax({
      url: '/notify',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
          "username": "username"
      }),
      dataType: 'json',
          success: function (textStatus, status) {
          // console.log(textStatus);
          // console.log(status);
         },
          error: function(xhr, textStatus, error) {
          // console.log(xhr.responseText);
          // console.log(xhr.statusText);
          // console.log(textStatus);
          // console.log(error);
          }
  })
};

window.setInterval(function pollingWinner(){
  $.ajax({
      url: '/polling',
      type: 'GET',
      contentType: 'application/json',
      success : function(response) {
        let rr = $.parseJSON(response)
          if (rr["status"] == "none") {
            console.log(response, "None")
            //pass
          } else {
            console.log(rr["status"], "result")
          celebrateGoodTimes()
          alert("B I N G O "+ rr["username"] + " has won!")
          location.reload();
        }
      }
  })
}, 2500);

const table = document.querySelector("#tblBingo")
const letter = document.querySelectorAll(".letters-bingo")

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

// funciton gets random elements from array
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
let termList = ["need", "array", "of", "26", "words"]

let bingoTerms = getRandom(termList, 26)
// console.log(bingoTerms)

let iterator = 0;

for (i = 0; i < 5; i++) {
    let tr = document.createElement("tr")
    table.appendChild(tr)

    for (j = 0; j < 5; j++) {
        let td = document.createElement("td")
        td.id = bingoTerms[iterator].toString() 
        td.style.height = "20%"
        td.style.width = "20%"
        td.classList.add("main-table-cell")

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

        if(matchWin()) {
            letter[winningIterator].classList.add("show-bingo");

            winningIterator++;
            if(winningIterator === 1) {
                // Need to make a POST request here BEFORE alerting
                celebrateGoodTimes()
                notifyBingo()
                alert('B I N G O')
                setTimeout(() => { 
                  location.reload();
                }, 3000);
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

