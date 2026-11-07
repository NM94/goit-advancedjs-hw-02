import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const refs = {
 days: document.querySelector('[data-days]'),
 hours: document.querySelector('[data-hours]'),
 minutes: document.querySelector('[data-minutes]'),
 seconds: document.querySelector('[data-seconds]'),
}


let selectedDate = null;
let timerId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    selectedDate = selectedDates[0];

    if (!selectedDate) {
      startButton.disabled = true;
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      startButton.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    startButton.disabled = false;
  },
};

flatpickr(dateTimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days: d, hours: h, minutes: m, seconds: s }) {
  refs.days.textContent = addLeadingZero(d);
  refs.hours.textContent = addLeadingZero(h);
  refs.minutes.textContent = addLeadingZero(m);
  refs.seconds.textContent = addLeadingZero(s);
}

function startTimer() {
  if (!selectedDate) return;

  startButton.disabled = true;
  dateTimePicker.disabled = true;

  function subtraction() {
    const currentTime = Date.now();
    const remainingTime = selectedDate.getTime() - currentTime;

    if (remainingTime <= 0) {
      clearInterval(timerId);
      timerId = null;

      updateTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      dateTimePicker.disabled = false;
      return;
    }

    const time = convertMs(remainingTime);
    updateTimer(time);
  }

  subtraction();

  timerId = setInterval(subtraction, 1000);
}

startButton.addEventListener('click', startTimer);