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
  console.log(serie);
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
  for(let i = 0; i < results.length; i++) {
    const newLi = document.createElement('li');
    newLi.classList.add('serie-container');
    const liTitle = document.createElement('h2');
    liTitle.classList.add('serie-title');
    const liTitleContent = document.createTextNode(results[i].show.name);
    newLi.appendChild(liTitle);
    const liImg = document.createElement('IMG');
    liImg.setAttribute('src', results[i].show.image.medium);
    liImg.setAttribute('alt', results[i].show.name);
    liImg.setAttribute('id', results[i].show.name);
    newLi.appendChild(liImg);
    resultList.appendChild(newLi);
  }
}

//clean the last result removing all child from the ul tag
function cleanResults () {
  const listItems = document.querySelectorAll('.serie-container');
  for(const child of listItems) {
    resultList.removeChild(child);
  }

}


searchButton.addEventListener('click', clickHandler);