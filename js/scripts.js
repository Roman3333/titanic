let itemsElem = document.querySelector('.titanic__items');
let input = document.querySelector('.titanic__search');
let submit = document.querySelector('.titanic__submit');
let passengers = [];
let lastStep = 0;
let step = 20;

(() => {
  window.addEventListener('scroll', throttle(checkPosition, 250));
})();

async function givePassengers() {
  const response = await fetch(
    'https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json',
  );
  const data = await response.json();
  passengers.push(data);
  renderItems();
}

givePassengers();

function renderItems() {
  passengers[0].slice(`${lastStep}`, `${step}`).map((item) =>
    itemsElem.insertAdjacentHTML(
      'beforeend',
      `<div class="titanic__item">
<div class="titanic__top">
<div class="titanic__name">${item.name}</div>
<div class="titanic__gender">${item.gender[0].toUpperCase()}</div>
<div class="titanic__survived">${item.survived ? 'SURVIVED' : 'NOT SURVIVED'}</div>
<div class="titanic__age">${Math.ceil(item.age)}y</div>
</div>
<div class="titanic__bottom">
<div class="titanic__ticket">${item.ticket}</div>
<div class="titanic__cabin">${item.cabin}</div>
</div`,
    ),
  );
  lastStep += 20;
  step += 20;
}

//небольшая задержка
function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    renderItems();
  }
}

input.oninput = function (e) {
  e.preventDefault();
  let val = input.value.trim();
  let allItems = document.querySelectorAll('.titanic__item');
  allItems.forEach((item) => {
    if (
      !item
        .querySelector('.titanic__top .titanic__name')
        .textContent.toLowerCase()
        .includes(val.toLowerCase()) &&
      !item
        .querySelector('.titanic__top .titanic__gender')
        .textContent.toLowerCase()
        .includes(val.toLowerCase()) &&
      !item
        .querySelector('.titanic__top .titanic__age')
        .textContent.toLowerCase()
        .includes(val.toLowerCase()) &&
      !item
        .querySelector('.titanic__top .titanic__survived')
        .textContent.toLowerCase()
        .startsWith(val.toLowerCase())
    ) {
      item.classList.add('hide');
    } else {
      item.classList.remove('hide');
    }
  });
};

submit.onclick = (e) => {
  e.preventDefault();
};
