// global variables //////////////////////
/////////////////////////////////////////
const board = document.getElementById("board");

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

function findCarbonCopy() {
  return document.getElementById("copied-sticker");
}

// copy a sticker /////////////////////////////////////
//////////////////////////////////////////////////////
function copy(sticker) {
  let newClass = findModifierClass(sticker);

  if (!existsCarbonCopy()) return createCarbonCopy(newClass);
  swapClassOnCopy(newClass);
}

// identify the correct sticker to copy
function findModifierClass(sticker) {
  let regexStickerClasses = new RegExp(/(sticker--)/);
  let classListArray = Array.from(sticker.classList);
  let filteredList = classListArray.filter((i) => regexStickerClasses.test(i));
  return filteredList[0];
}

function swapClassOnCopy(newClass) {
  // always called after a successfull existsCarbonCopy()
  let carbonCopy = findCarbonCopy();
  let oldClass = findModifierClass(carbonCopy);

  carbonCopy.classList.remove(oldClass);
  carbonCopy.classList.add(newClass);
}

// interacting with the carbon copy /////////////////
////////////////////////////////////////////////////
// drag the carbon copy over the whiteboard
function dragCarbonCopy(event) {
  if (!existsCarbonCopy()) return;

  let carbonCopy = findCarbonCopy();
  let mouseX = event.clientX;
  let mouseY = event.clientY;

  carbonCopy.style.position = "absolute";
  carbonCopy.style.left = `${mouseX}px`;
  carbonCopy.style.top = `${mouseY}px`;
}

// paste a copy onto the whiteboard /////////////////
////////////////////////////////////////////////////
function dropCarbonCopy() {
  let carbonCopy = findCarbonCopy();
  carbonCopy.classList.add("pasted");
  carbonCopy.setAttribute("draggable", "true");
  carbonCopy.removeAttribute("id", "copied-sticker");
}

function pasteCarbonCopy() {
  if (!existsCarbonCopy()) return;
  let carbonCopy = findCarbonCopy();
  let newClass = findModifierClass(carbonCopy);

  dropCarbonCopy();
  createCarbonCopy(newClass);
}

// delete carbon copy /////////////////////////
//////////////////////////////////////////////
function deleteCarbonCopy() {
  if (!existsCarbonCopy()) return;

  findCarbonCopy().remove();
}

// event listeners /////////////////////////
///////////////////////////////////////////
// copy sticker
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
board.addEventListener("dragover", (e) => {
  e.preventDefault();
});

board.addEventListener("dragenter", (e) => {
  let sticker = e.target;

  sticker.style.opacity = "0%";
  sticker.setAttribute("id", "used-sticker");
});

board.addEventListener("dragleave", (e) => {
  let sticker = e.target;

  sticker.style.position = "absolute";
  sticker.style.top = `${e.clientY - 30}px`;
  sticker.style.left = `${e.clientX - 30}px`;
});

board.addEventListener("dragend", (e) => {
  let sticker = document.getElementById("used-sticker");
  sticker.style.opacity = "100%";
  sticker.removeAttribute("id", "used-sticker");
});
