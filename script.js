//дебаунс для задержки запросов:
function debounce(fn, debounceTime) {
  let delay;
  return function () {
    clearTimeout(delay);
    delay = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
}

//функция с запросом к серверу
function getRepositories(inputData) {
  return new Promise((resolve) => {
    fetch(`https://api.github.com/search/repositories?q=${inputData}`)
      .then(response => response.json())
      .then(res => {
        arrayOfRepo = [];
        for (let i = 0; i < 5; i++) {
          arrayOfRepo.push(res.items[i]);
        }
        optionsBlock.hidden = false;
        // console.log(res);
        // console.log(arrayOfRepo);
        return (arrayOfRepo);
      })
      .then(() => changeAutocomplete())
      .catch(err => console.log(err));
    resolve();
  }).catch(error => console.log(error))
}

//функция представления информации в автокомплите
function changeAutocomplete() {
  try {arrayOfRepo.map((repo, i) => {
    optionsButtons[i].textContent = repo.name;
  })} catch (e) {
    console.log(e + '-так вышло');
  }
}

//функция добавления репозитория в результирующий список
function addToResultList(num) {
  let name = document.createElement('p');
  let owner = document.createElement('p');
  let stars = document.createElement('p');
  let removeBtn = document.createElement('button');
  let item = document.createElement('li');
  name.classList.add("result-block__item-name");
  owner.classList.add("result-block__item-owner");
  stars.classList.add("result-block__item-stars");
  removeBtn.classList.add("result-block__item-remove");
  item.classList.add('result-block__item');
  name.textContent = `Name: ${arrayOfRepo[num].name}`;
  owner.textContent = `Owner: ${arrayOfRepo[num].owner.login}`;
  stars.textContent = `Stars: ${arrayOfRepo[num].stargazers_count}`;
  item.append(name, owner, stars, removeBtn);
  resultContainer.append(item);
}

//список переменных
const input = document.querySelector('.search-block__input');
const optionsBlock = document.querySelector('.search-block__list');
const optionsButtons = document.querySelectorAll('.search-block__item-button');
const resultContainer = document.querySelector('.result-block__list');
let arrayOfRepo = [];
let inputData = '';
const debounceTime = 400;

//оборачиваем запрос в дебаунс
const debounceRequest = debounce(() => getRepositories(inputData), debounceTime);


//обработчик на закрытие айтемов результата:
resultContainer.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('result-block__item-remove')) {
    evt.target.closest('li').remove();
  }
})

//обработчик на изменение текста инпута,
//обрезаем пробелы, проверяем на наличие символов
input.addEventListener('input', function () {
  inputData = input.value.trim();
  if (!inputData) {
    optionsBlock.hidden = true;
    return
  }
  debounceRequest();
});

//обработчик для добавления в список
optionsBlock.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('search-block__item-button')) {
    addToResultList(Number(evt.target.dataset.number));
    optionsBlock.hidden = true;
    arrayOfRepo = [];
    input.value = '';
  }
});



