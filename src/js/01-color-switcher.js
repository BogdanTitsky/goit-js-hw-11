function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

const btnStart = document.querySelector('[data-start]');
const btnStop = document.querySelector('[data-stop]');
const body = document.body;
let timerId = null;

btnStart.addEventListener('click', startColorChange);
btnStop.addEventListener('click', stopColorChange);

function startColorChange() {
  btnStart.disabled = true;
  btnStop.disabled = false;
  body.style.backgroundColor = getRandomHexColor();

  timerId = setInterval(() => {
    body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function stopColorChange() {
  btnStart.disabled = false;
  btnStop.disabled = true;

  clearTimeout(timerId);
}
