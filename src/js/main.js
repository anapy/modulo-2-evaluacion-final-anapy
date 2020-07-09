'use strict';

const searchButton = document.querySelector('.js-search');
const serieInput = document.querySelector('.js-serie');
let resultList = document.querySelector('.js-list-results');
let serie = '';
let results = [];

function clickHandler(ev) {
  ev.preventDefault();
  cleanResults();
  serie = serieInput.value;
  getApiData();
}

function getApiData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${serie}`)
    .then(response => response.json())
    .then(data => {
      results = data;
      printResults();
    });
}

//print the series given by the api
//creates the elements by DOM appending to ul tag each li with its proper content
function printResults() {
  if(results.length === 0) {
    const error = document.createElement('p');
    error.classList.add('error');
    const errorContent = document.createTextNode('La serie buscada no está en nuestro listado, prueba de nuevo');
    error.appendChild(errorContent);
    resultList.appendChild(error);
  } else {
    for(let i = 0; i < results.length; i++) {
      const newLi = document.createElement('li');
      newLi.classList.add('serie-container');
      const liTitle = document.createElement('h2');
      liTitle.classList.add('serie-title');
      const liTitleContent = document.createTextNode(results[i].show.name);
      liTitle.appendChild(liTitleContent);
      newLi.appendChild(liTitle);
      const liImg = document.createElement('IMG');
      checkImg(i, liImg);
      liImg.setAttribute('alt', results[i].show.name);
      liImg.setAttribute('id', results[i].show.name);
      newLi.appendChild(liImg);
      resultList.appendChild(newLi);
    }
  }

}

//clean the last result removing all child from the ul tag or the error message
function cleanResults () {
  const listItems = document.querySelectorAll('.serie-container');
  for(const child of listItems) {
    resultList.removeChild(child);
  }
  const errors = document.querySelector('.error');
  if(errors !== null) {
    resultList.removeChild(errors);
  }
}

//checkImg checks whether is an image on the result array//
function checkImg(index, item) {
  if(results[index].show.image.medium === null) {
    item.setAttribute('src', 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
  } else
    item.setAttribute('src', results[index].show.image.medium);
}

searchButton.addEventListener('click', clickHandler);