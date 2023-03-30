const board = document.getElementById("board");
let stickers = document.querySelectorAll(".sticker");
stickers.forEach((sticker) => {
  sticker.addEventListener("click", () => grab(sticker));
});

// templates //////////////////////////
//////////////////////////////////////
function createTemplate(script) {
  let template = document.createElement("template");
  template.innerHTML = script.trim();
  return template.content.firstElementChild;
}

// grab the stickers /////////////////
/////////////////////////////////////
function grab(element) {
  let stickerClass = Array.from(element.classList).filter((i) =>
    new RegExp(/(sticker--)/).test(i)
  )[0];
  let copiedSticker = createTemplate(`
    <div class='copied-sticker'></div>
  `);
  copiedSticker.classList.add(stickerClass);
  board.append(copiedSticker);
}

// drop stickers /////////////////////
/////////////////////////////////////
function drop() {
  let copiedSticker = document.querySelector(".copied-sticker");
  if (!copiedSticker) return;

  copiedSticker.classList.remove("copied-sticker");
  console.log("done");
}

board.addEventListener("click", () => drop());

// track the mouse around the board//
////////////////////////////////////
function drag(event) {
  let copiedSticker = document.querySelector(".copied-sticker");
  if (!copiedSticker) return;

  let mouseX = event.clientX;
  let mouseY = event.clientY;

  copiedSticker.style.position = "absolute";
  copiedSticker.style.left = `${mouseX}px`;
  copiedSticker.style.top = `${mouseY}px`;
}

document.addEventListener("mousemove", (e) => drag(e));

// drop the stickers///////////////
//////////////////////////////////
