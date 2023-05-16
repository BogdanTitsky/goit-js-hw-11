import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.form');
const button = document.querySelector('.form button');
const delayInput = form.elements.delay;
const stepInput = form.elements.step;
const amountInput = form.elements.amount;

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

button.addEventListener('click', event => {
  event.preventDefault();

  const delay = Number(delayInput.value);
  const step = Number(stepInput.value);
  const amount = Number(amountInput.value);

  const promises = [];
  for (let i = 0; i < amount; i++) {
    const curentDelay = delay + i * step;
    const promise = createPromise(i + 1, curentDelay);
    promises.push(promise);
  }

  if (promises.length <= amount) {
    promises.forEach(promise => {
      promise
        .then(({ position, delay }) => {
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        });
    });
  }
});
