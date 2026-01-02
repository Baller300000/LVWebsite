window.onload = function () {

    let table = document.querySelector("#table");
    let h1 = document.querySelector("#heading")
    let i, j, x, y;
    let lose = false;//for displaying win or lose
    let bomb = "#";

    function Create2DArray(rows, columns) {
        var x = new Array(rows);
        for (i = 0; i < rows; i++) {
            x[i] = new Array(columns);
        }
        return x;
    }

    let rc = 10; //rc--> rowAndColumn

    let td = Create2DArray(rc, rc);
    let bs //bw-->boxsize

    if (window.innerHeight < window.innerWidth) {
        bs = window.innerHeight;
    } else {
        bs = window.innerWidth;
    }

    function Box(box, i, j) {
        this.i = i;
        this.j = j;
        this.box = box;
        this.hidden = true;
    }

    function generateTable(table) {
        for (i = 0; i < rc; i++) {
            let row = table.insertRow();
            for (j = 0; j < rc; j++) {
                let cell = row.insertCell();
                let text = document.createTextNode(" ");
                cell.style.border = "solid 2px black";
                cell.style.height = ((bs - 100) / 10) + "px";
                cell.style.width = ((bs - 100) / 10) + "px";
                cell.style.fontWeight = "bold";
                cell.style.textAlign = "center";
                cell.style.backgroundColor = "green";
                cell.style.textIndent = "-9999px";
                cell.style.fontSize = "30px";
                cell.style.padding = "0px";
                cell.appendChild(text);
                td[i][j] = new Box(cell, i, j);
            }
        }
    }
    generateTable(table);

    //To place bombs
    for (i = 0; i < rc; i++) {
        let bx = Math.floor(Math.random() * rc); //bx-->bombX
        let by = Math.floor(Math.random() * rc); //by-->bombY

        if ((bx - 1 >= 0 && td[bx - 1][by].box.innerText == bomb) ||
            (bx + 1 < rc && td[bx + 1][by].box.innerText == bomb)) {
            i--;
            continue;
        }

        if (td[bx][by].box.innerText != bomb) {
            td[bx][by].box.innerText = bomb;
            td[bx][by].hidden = false;
        } else i--;

    }

    //Increment neighbour surrounded by the bomb
    for (i = 0; i < rc; i++) {
        for (j = 0; j < rc; j++)
            if (td[i][j].box.innerText == bomb) {
                for (x = i - 1; x <= i + 1; x++) {
                    for (y = j - 1; y <= j + 1; y++) {
                        if ((x != -1) && (x != rc) &&
                            (y != -1) && (y != rc))
                            if (td[x][y].box.innerText != bomb) {
                                td[x][y].box.innerText++;
                            }
                    }
                }
            }
    }


    table.addEventListener("click", start);

    function start(e) {
        let boxSelect = e.target.closest("td");

        if (!boxSelect) return;

        for (i = 0; i < rc; i++)
            for (j = 0; j < rc; j++) {
                if (boxSelect == td[i][j].box) {
                    if (boxSelect.innerText == "#") {
                        h1.innerText = "Game Over";
                        alert("GAME OVER");
                        revealall();
                    }
                    checkEmpty(i, j);
                    if (boxSelect.innerText != "") {
                        boxSelect.style.backgroundColor = "white";
                        boxSelect.style.textIndent = "0px";
                        td[i][j].hidden = false;
                    }
                }
            }

        if ((td[0].every(win)) &&
            (td[1].every(win)) &&
            (td[2].every(win)) &&
            (td[3].every(win)) &&
            (td[4].every(win)) &&
            (td[5].every(win)) &&
            (td[6].every(win)) &&
            (td[7].every(win)) &&
            (td[8].every(win)) &&
            (td[9].every(win))) {
            if (!lose) {
                heading.innerText = "YOU WON MINESWEEPER";
                alert("You won the game");
            }
            table.removeEventListener("click", start);
        }
    }

    function win(b) {
        return (!(b.hidden));
    }

    function checkEmpty(x, y) {
        if (td[x][y].box.style.backgroundColor != "white")
            if (td[x][y].box.innerText == "") {
                reveal(x, y);
                checkNeighbour(x, y);
            }
    }

    function checkNeighbour(i, j) {
        if (i - 1 >= 0 && i - 1 < rc && j - 1 >= 0 && j - 1 < rc) {
            checkEmpty(i - 1, j - 1);
            reveal(i - 1, j - 1);
        }

        if (i - 1 >= 0 && i - 1 < rc && j >= 0 && j < rc) {
            checkEmpty(i - 1, j);
            reveal(i - 1, j);
        }

        if (i - 1 >= 0 && i - 1 < rc && j + 1 >= 0 && j + 1 < rc) {
            checkEmpty(i - 1, j + 1);
            reveal(i - 1, j + 1);
        }

        if (i >= 0 && i < rc && j + 1 >= 0 && j + 1 < rc) {
            checkEmpty(i, j + 1);
            reveal(i, j + 1);
        }

        if (i + 1 >= 0 && i + 1 < rc && j + 1 >= 0 && j + 1 < rc) {
            checkEmpty(i + 1, j + 1);
            reveal(i + 1, j + 1);
        }

        if (i + 1 >= 0 && i + 1 < rc && j >= 0 && j < rc) {
            checkEmpty(i + 1, j);
            reveal(i + 1, j);
        }

        if (i + 1 >= 0 && i + 1 < rc && j - 1 >= 0 && j - 1 < rc) {
            checkEmpty(i + 1, j - 1);
            reveal(i + 1, j - 1);
        }

        if (i >= 0 && i < rc && j - 1 >= 0 && j - 1 < rc) {
            checkEmpty(i, j - 1);
            reveal(i, j - 1);
        }
    }

    function reveal(x, y) {
        td[x][y].box.style.backgroundColor = "white";
        td[x][y].box.style.textIndent = "0px";
        td[x][y].hidden = false;
    }

    function revealall() {
        for (x = 0; x < rc; x++)
            for (y = 0; y < rc; y++) {
                reveal(x, y);
                if (x == rc - 1 && y == rc - 1)
                    lose = true;
            }
    }


}