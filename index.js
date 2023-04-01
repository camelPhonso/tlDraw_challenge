// global variables //////////////////////
/////////////////////////////////////////
const board = document.getElementById("board");
const picker = document.getElementById("picker");

// templates //////////////////////////
//////////////////////////////////////
function createTemplate(script) {
  let template = document.createElement("template");
  template.innerHTML = script.trim();
  return template.content.firstElementChild;
}

function createCarbonCopy(givenClass) {
  let copy = createTemplate(`
  <div id='copied-sticker' class='${givenClass}'></div>
  `);
  board.append(copy);
  return copy;
}

// guarantee a carbon copy of a sticker exists before any action //////////
//////////////////////////////////////////////////////////////////////////
let existsCarbonCopy = () => {
  return document.getElementById("copied-sticker") !== null ? true : false;
};

// copy a sticker /////////////////////////////////////
//////////////////////////////////////////////////////
function copy(sticker) {
  let newClass = findModifierClass(sticker);

  if (existsCarbonCopy()) return swapClassOnCopy(newClass);
  createCarbonCopy(newClass);
}

// identify the correct sticker to copy
function findModifierClass(sticker) {
  let regexModifierClass = new RegExp(/(sticker--)/);
  let classListArray = Array.from(sticker.classList);
  let filteredList = classListArray.filter((i) => regexModifierClass.test(i));

  return filteredList[0]; // only one modifier class applied to a sticker at any time
}

function swapClassOnCopy(newClass) {
  // ONLY ever called after a successfull existsCarbonCopy()
  let carbonCopy = document.getElementById("copied-sticker");
  let oldClass = findModifierClass(carbonCopy);

  carbonCopy.classList.remove(oldClass);
  carbonCopy.classList.add(newClass);
}

// interacting with the carbon copy /////////////////
////////////////////////////////////////////////////
// drag the carbon copy over the whiteboard
function dragCarbonCopy(event) {
  if (!existsCarbonCopy()) return;

  let carbonCopy = document.getElementById("copied-sticker");
  let mouseX = event.clientX;
  let mouseY = event.clientY;

  carbonCopy.style.position = "absolute";
  carbonCopy.style.left = `${mouseX}px`;
  carbonCopy.style.top = `${mouseY}px`;
}

// paste a copy onto the whiteboard /////////////////
////////////////////////////////////////////////////
function dropCarbonCopy() {
  let carbonCopy = document.getElementById("copied-sticker");
  carbonCopy.classList.add("pasted");
  carbonCopy.setAttribute("draggable", "true");

  addListeners(carbonCopy);

  carbonCopy.removeAttribute("id", "copied-sticker");
}

function pasteCarbonCopy() {
  if (!existsCarbonCopy()) return;
  let carbonCopy = document.getElementById("copied-sticker");
  let newClass = findModifierClass(carbonCopy);

  dropCarbonCopy();
  createCarbonCopy(newClass);
}

// delete carbon copy /////////////////////////
//////////////////////////////////////////////
function deleteCarbonCopy() {
  if (!existsCarbonCopy()) return;

  document.getElementById("copied-sticker").remove();
}

function deleteUsedSticker() {
  document.getElementById("used-sticker").remove();
}

// event listeners /////////////////////////
///////////////////////////////////////////
// make a carbon copy of a sticker in the picker tab
let stickers = document.querySelectorAll(".sticker");
stickers.forEach((sticker) => {
  sticker.addEventListener("click", () => copy(sticker));
});

// drag carbon copy
document.addEventListener("mousemove", (e) => dragCarbonCopy(e));

// paste carbon copy
board.addEventListener("click", () => pasteCarbonCopy());

// 'escape' out of the feature
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") return deleteCarbonCopy();
});

///// drag and drop used stickers ///////////////////
////////////////////////////////////////////////////
function addListeners(element) {
  // applied everytime a sticker is pasted
  element.addEventListener("dragenter", (e) => {
    let sticker = e.target;

    sticker.style.opacity = "0%";
    sticker.setAttribute("id", "used-sticker");
  });

  element.addEventListener("dragleave", (e) => {
    let sticker = document.getElementById("used-sticker");

    sticker.style.position = "absolute";
    sticker.style.top = `${e.clientY}px`;
    sticker.style.left = `${e.clientX}px`;
  });
}

board.addEventListener("dragover", (e) => {
  e.preventDefault();
  let picker = document.getElementById("picker");
  picker.classList.add("trash-bin");
});

board.addEventListener("dragend", (e) => {
  let sticker = document.getElementById("used-sticker");
  sticker.style.opacity = "100%";
  sticker.removeAttribute("id", "used-sticker");

  let trashBin = document.querySelector(".trash-bin");
  trashBin.classList.remove("trash-bin");
});

picker.addEventListener("dragover", (e) => {
  e.preventDefault(); // to prevent dragging animation when deleting a used sticker
});
