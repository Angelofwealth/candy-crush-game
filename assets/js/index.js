const candyBoard = document.querySelector(".candy-grid");
const scoreElement = document.getElementById("score");
const numOfSqPerRow = 8; //square per row
const squares = [];
let score = 0;

const candy = [
  "url('assets/images/blue.png')",
  "url('assets/images/yellow.png')",
  "url('assets/images/red.png')",
  "url('assets/images/purple.png')",
  "url('assets/images/orange.png')",
  "url('assets/images/green.png')",
];

function populateBoard() {
  for (let index = 0; index < numOfSqPerRow * numOfSqPerRow; index++) {
    const square = document.createElement("div");
    const randomCandy = Math.floor(Math.random() * candy.length);

    square.style.backgroundImage = candy[randomCandy];

    square.setAttribute("draggable", true);
    square.setAttribute("id", index);

    candyBoard.appendChild(square);
    squares.push(square);
  }
}

populateBoard();

let candyBeingDragged;
let candyIdBeingDragged;
let candyBeingDropped;
let candyIdBeingDropped;

squares.forEach((square) => square.addEventListener("dragstart", dragStart));

squares.forEach((square) => square.addEventListener("dragend", dragEnd));

squares.forEach((square) => square.addEventListener("dragover", dragOver));

squares.forEach((square) => square.addEventListener("dragenter", dragEnter));

squares.forEach((square) => square.addEventListener("dragleave", dragLeave));

squares.forEach((square) => square.addEventListener("drop", dragDrop));

function dragStart(event) {
  console.log(this.id, "drag start");
  this.classList.add("dragging");
  // or you can write event.target.classList.add('dragging')

  candyBeingDragged = this.style.backgroundImage;
  candyIdBeingDragged = +this.id;
  // +this. is how to change strings to variable
}
function dragEnd(event) {
  console.log(this.id, "drag end");
  this.classList.remove("dragging");
  // or you can write event.target.classList.remove('dragging')

  const validMoves = [
    candyIdBeingDragged - 1, //left
    candyIdBeingDragged - numOfSqPerRow, //above
    candyIdBeingDragged + numOfSqPerRow, //below
    candyIdBeingDragged + 1, //right
  ];

  const isValidMove = validMoves.includes(candyIdBeingDropped);

  //   // run this at drag end
  //   checkRowForThree();
  //   checkColumnForThree();

  if (candyIdBeingDropped && isValidMove) {
    const isColumnOfFourMMatched = checkColumnForFour();
    const isRowOfFourMatched = checkRowForFour();
    const isRowOfThreeMatched = checkRowForThree();
    const isColumnOfThreeMatched = checkColumnForThree();

    if (
      !isRowOfThreeMatched &&
      !isColumnOfThreeMatched &&
      !isRowOfFourMatched &&
      !isColumnOfFourMMatched
    ) {
      squares[candyIdBeingDropped].style.backgroundImage = candyBeingDropped;
      squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
    }
  } else if (candyIdBeingDropped && !isValidMove) {
    //    return to original state
    squares[candyIdBeingDropped].style.backgroundImage = candyBeingDropped;
    squares[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
  }
}
function checkRowForThree() {
  for (let index = 0; index <= 61; index++) {
    const rowOfThree = [index, index + 1, index + 2];
    const decidingCandy = squares[index].style.backgroundImage;
    const isBlank = squares[index].style.backgroundImage === "";

    const notValidAreas = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55,
    ];

    if (notValidAreas.includes(index)) {
      continue;
    }

    if (
      rowOfThree.every(
        (item) =>
          squares[item].style.backgroundImage === decidingCandy && !isBlank
      )
    ) {
      score += 3;
      scoreElement.textContent = score;

      rowOfThree.forEach((val) => (squares[val].style.backgroundImage = ""));
      return true;
    }
  }

  return false;
}

function checkColumnForThree() {
  for (let index = 0; index < 47; index++) {
    const columnOfThree = [
      index,
      index + numOfSqPerRow, //8
      index + numOfSqPerRow * 2, //8*2
    ];
    const decideCandy = squares[index].style.backgroundImage;
    const isBlank = squares[index].style.backgroundImage === "";
    const isMatched = columnOfThree.every(
      (item) => squares[item].style.backgroundImage === decideCandy && !isBlank
    );

    if (isMatched) {
      score += 3;
      scoreElement.textContent = score;
      columnOfThree.forEach((val) => (squares[val].style.backgroundImage = ""));
      return true;
    }
  }

  return false;
}

// checking roww for four

function checkRowForFour() {
  for (let index = 0; index < 60; index++) {
    const rowOfFour = [index, index + 1, index + 2, index + 3];
    const decideCandy = squares[index].style.backgroundImage;
    const isBlank = squares[index].style.backgroundImage === "";
    const notValidAreas = [
      5, 6, 7, 13, 14, 15, 21, 22, 23, 28, 30, 31, 37, 38, 39, 45, 46, 47, 53,
      54, 55,
    ];
    if (notValidAreas.includes(index)) {
      continue;
    }

    const isMatched = rowOfFour.every(
      (item) => squares[item].style.backgroundImage === decideCandy && !isBlank
    );
    if (isMatched) {
      score = +4;
      scoreElement.textContent = score;
      rowOfFour.forEach((val) => (squares[val].style.backgroundImage = ""));
      return true;
    }
  }
  return false;
}

// check column for four

function checkColumnForFour() {
  for (let index = 0; index < 39; index++) {
    const columnOfFour = [
      index,
      index + numOfSqPerRow,
      index + numOfSqPerRow * 2,
      index + numOfSqPerRow * 3,
    ];
    const decideCandy = squares[index].style.backgroundImage;
    const isBlank = squares[index].style.backgroundImage === "";

    const isMatched = columnOfFour.every(
      (item) => squares[item].style.backgroundImage === decideCandy && !isBlank
    );

    if (isMatched) {
      score = +4;
      scoreElement.textContent = score;
      columnOfFour.forEach((val) => (squares[val].style.backgroundImage = ""));
      return true;
    }
  }
  return false;
}

function moveCandiesDown() {
  for (let index = 0; index <= 55; index++) {
    const isTheSquareBelowBlank =
      squares[index + numOfSqPerRow].style.backgroundImage === "";

    // populate first row with candies if blank
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    firstRow.forEach((val) => {
      if (squares[val].style.backgroundImage === "") {
        const randomCandy = Math.floor(Math.random() * candy.length);
        squares[val].style.backgroundImage = candy[randomCandy];
      }
    });

    if (isTheSquareBelowBlank) {
      squares[index + numOfSqPerRow].style.backgroundImage =
        squares[index].style.backgroundImage;

      squares[index].style.backgroundImage = "";
    }
  }
}

setInterval(() => {
  checkColumnForFour();
  checkRowForFour();
  checkColumnForThree();
  checkRowForThree();
  moveCandiesDown();
}, 100);

function dragOver(event) {
  console.log(this.id, "drag over");
  this.style.border = "9px solid black";
  event.preventDefault(); //allow drop
}
function dragEnter(event) {
  console.log(this.id, "drag enter");
  event.preventDefault(); //allows drop too
}
function dragLeave(event) {
  console.log(this.id, "drag leave");
  this.style.border = "none";
}
function dragDrop(event) {
  console.log(this.id, "drag drop");
  this.style.border = "none";

  candyBeingDropped = this.style.backgroundImage;
  candyIdBeingDropped = +this.id;

  //  then swap the boxs
  this.style.backgroundImage = candyBeingDragged;
  squares[candyIdBeingDragged].style.backgroundImage = candyBeingDropped;
}
