/*I will save all the blocks in an array, that will let me sort them and show in 
different positions any time and at any clear or new game*/
var divsArray = [],
    winSesion = 2,
    random = [],
    backgroundImg,
    numOfBlocks = 3, //9;
    correctArray = new Map(), //will use this to detect when the image is in the correct place and when user want to start again
    shuffledArray = new Map(); //will use this in case that the user hit Clear Button


function sesionToWin(){
    winSesion = 2;
    shuffledArray.clear();
    random.splice(0,random.length); //used to swap the blocks
    
    divsArray.forEach(e=> {
      random.push(e.id != ((numOfBlocks-1) + "" + (numOfBlocks-1)) ? e.id : null);
      e.style.backgroundPosition = correctArray.get(e.id);
      e.style.backgroundImage = "url(" + backgroundImg + ")"; }); 
    
    divsArray[divsArray.length-1].style.backgroundPosition =  divsArray[divsArray.length-2].style.backgroundPosition;
    divsArray[divsArray.length-1].style.backgroundImage = divsArray[divsArray.length-2].style.backgroundImage; 
    divsArray[divsArray.length-2].style.backgroundPosition="";
    divsArray[divsArray.length-2].style.backgroundImage="";
}    

function cleanWinMessage(){
  if(document.getElementById("winnerSection")){
    let child = document.getElementById("winnerSection");
    child.parentNode.removeChild(child);
  }
}

function playAgain(){
      //checking if win message should be removed
    cleanWinMessage();
    //this clean the array of divs and the map of shuffledArray due to a new sort
    shuffledArray.clear();
    random.splice(0,random.length); //used to swap the blocks
    
    divsArray.forEach(e=> {
      random.push(e.id != ((numOfBlocks-1) + "" + (numOfBlocks-1)) ? e.id : null);
      e.style.backgroundPosition = correctArray.get(e.id);
      e.style.backgroundImage = "url(" + backgroundImg + ")"; }); 
    
    divsArray[divsArray.length-1].style.backgroundPosition="";
    divsArray[divsArray.length-1].style.backgroundImage="";
    sortBlocks(); //calling to this will create a panel
  }

function clear(){
  //this copy into the array of divs the shuffled position on the original game
  divsArray.forEach(e=> {
    e.style.backgroundPosition = shuffledArray.get(e.id);
    e.style.backgroundImage = "url(" + backgroundImg + ")"; });
  
  divsArray[divsArray.length-1].style.backgroundPosition="";
  divsArray[divsArray.length-1].style.backgroundImage="";
}

function swapBlocks(sourceElement, destinyElement, changeImages) {

   let destiny = document.getElementById(destinyElement),
        source = document.getElementById(sourceElement),
    //saving the source and destiny position in an auxiliar
        destinyPosition = window.getComputedStyle(destiny).getPropertyValue("background-position"),
        sourcePosition = window.getComputedStyle(source).getPropertyValue("background-position");

    //switching them    
        // document.getElementById(destinyElement).style.backgroundPosition = sourcePosition;
        destiny.style.backgroundPosition = sourcePosition;
        // document.getElementById(sourceElement).style.backgroundPosition = destinyPosition;
        source.style.backgroundPosition = destinyPosition;

    if (changeImages){
        //means that this function is being called by the user wanting to move the blocks
        destiny.style.backgroundImage = source.style.backgroundImage;
        source.style.backgroundImage = "";
        
    }    
    
}

function sortBlocks() {
  //to visible sort the blocks I will change just the background position for the image
  for (let x = 0; x < numOfBlocks; x++) {
    for (let y = 0; y < numOfBlocks; y++) {
      let blockId = x + "" + y, index;
        if (x == numOfBlocks-1 && y == numOfBlocks-1){
          break; //will not do this for latest block
        }
        do {
          index = Math.floor(Math.random() * random.length);
        } while (random[index] == null || random[index] == blockId);

        destiny = random[index];
        swapBlocks(blockId, destiny, false);

        //remove the index to avoid duplicates
        random.splice(index,1);
    }
  }

  //once all the block are swapped
  divsArray.forEach(e => {
    shuffledArray.set(e.id, e.style.backgroundPosition); //will save the id with the position in case of hit clear button
  }) 
}

function CanMove (blockId) {

  //here will be the code to check if the selected block can be moved
    let row = parseInt(blockId.substr(0,1)),
        col = parseInt(blockId.substr(1,1)),
        newId;  
  
   //check at right cell, so row is the same and col is col + 1 
        if (col+1 < numOfBlocks){
            newId = row +""+ (col+1);
            if (window.getComputedStyle(document.getElementById(newId)).backgroundImage == "none"){
                return newId;
            }
        } 

    //check at below cell, so row is row + 1 and col is the same
        if (row+1 < numOfBlocks){
            newId = (row+1) + "" + col;
            if (window.getComputedStyle(document.getElementById(newId)).backgroundImage == "none"){
                return newId;
            }
        }   
       
     //check at lef cell, row is the same, col is col - 1
        if (col-1 >= 0){
            newId = row + "" + (col-1);
            if (window.getComputedStyle(document.getElementById(newId)).backgroundImage == "none"){
                return newId;
            }
        }  
        
     //check at above cell, so row is row - 1 and col is the same
        if (row-1 >= 0){
            newId = (row-1) + "" + col;
            if (window.getComputedStyle(document.getElementById(newId)).backgroundImage == "none"){
                return newId;
            }
        } 
        
        return null;
};

function addWinMessage(){
  // let body = document.getElementsByTagName("body"),
   let section = document.createElement("section"),
      div = document.createElement("div"),
      text = document.createTextNode("And the winner is.......!!   YOU ROCK!");
      section.id ="winnerSection";
      div.id="winMessage";

      document.body.appendChild(section);
      section.appendChild(div);
      div.appendChild(text);

}

function checkIfWin() {
  let isTheWinner = true;
  divsArray.forEach(e=>{
    if(e.style.backgroundPosition != correctArray.get(e.id)){
      isTheWinner =  false;
  }});
  return isTheWinner;
}

function mouseClicked(element) {
  // this is going to interchange the blocks if possible

  switch (element.srcElement.id) {
    case "playAgain":
          if (winSesion == 0){
            sesionToWin();
          } else {
            winSesion--;
            playAgain();
          }

      break;
    case "clear":
          clear();
      break;
    case "":  //others part of the screen
      break;
    default:
      let idToMove = CanMove(element.srcElement.id);
        if (idToMove){
            swapBlocks(element.srcElement.id,idToMove, true);
          if(checkIfWin()){
            addWinMessage();
          }
        }   

  }

}

const Blocks = () => {
  //here will be the code for the division of image in blocks
  document.onclick = mouseClicked;
  winSesion--;
  let imageDiv = document.getElementById("slice"),
    width = imageDiv.offsetWidth,
    heigth = imageDiv.offsetHeight;
    backgroundImg = document.getElementById("gameImage").getAttribute("src");
  // two loops to define each block height, width and relative position
  for (let x = 0; x < numOfBlocks; x++) {
    for (let y = 0; y < numOfBlocks; y++) {

      let blockTopPosition = (y * heigth) / numOfBlocks + "px";
      let blockLeftPosition = (x * width) / numOfBlocks + "px",
        backgroundPosX = -((width / numOfBlocks) * x) + "px",
        backgroundPosTop = -((heigth / numOfBlocks) * y) + "px";
      let div = document.createElement("div");
    //for last block I do not want to show the image
      if (x == numOfBlocks - 1 && y == numOfBlocks - 1) {
        div.style.backgroundImage = "";
        div.style.backgroundPosition = "";
      } else {
        div.style.backgroundImage = "url(" + backgroundImg + ")";
        div.style.backgroundPosition = backgroundPosX + " " + backgroundPosTop;
      }
      //relative position of each block
      div.style.left = blockLeftPosition;
      div.style.top = blockTopPosition;
      //each block size
      div.style.width = width / numOfBlocks + "px";
      div.style.height = heigth / numOfBlocks + "px";
      div.id = y + "" + x;

      divsArray.push(div);
      random.push(div.id != ((numOfBlocks-1) + "" + (numOfBlocks-1)) ? div.id : null); //used to swap the blocks
      correctArray.set(y + "" + x, 
      div.id != ((numOfBlocks-1) + "" + (numOfBlocks-1)) ? div.style.backgroundPosition : "0% 0%"); //saving here the correct position of each element must have
      imageDiv.appendChild(div);
    }
  }

  sortBlocks();

};

window.onload = function () {
  var slice = Blocks();
};
