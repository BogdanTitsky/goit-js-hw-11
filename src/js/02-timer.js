import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const btnStart = document.querySelector('[data-start]');
btnStart.disabled = true;

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let timeLeft = 0;
let timeLeftInMs = 0;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= options.defaultDate) {
      Notify.failure('Please choose a date in the future');
      btnStart.disabled = true;
    } else {
      btnStart.disabled = false;
      timeLeftInMs = selectedDates[0].getTime() - options.defaultDate;
      timeLeft = convertMs(timeLeftInMs);
      console.log(timeLeft);
      updateCountdown();
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateCountdown() {
  daysEl.textContent = addLeadingZero(timeLeft.days);
  hoursEl.textContent = addLeadingZero(timeLeft.hours);
  minutesEl.textContent = addLeadingZero(timeLeft.minutes);
  secondsEl.textContent = addLeadingZero(timeLeft.seconds);
}

btnStart.addEventListener('click', () => {
  if (timeLeftInMs > 0) {
    btnStart.disabled = true;

    intervalId = setInterval(() => {
      timeLeftInMs -= 1000;
      timeLeft = convertMs(timeLeftInMs);
      updateCountdown();
      if (timeLeftInMs < 1000) {
        clearInterval(intervalId);
      }
    }, 1000);
  }
});
