'use strict';

const searchButton = document.querySelector('.js-search');
const serieInput = document.querySelector('.js-serie');
const resultList = document.querySelector('.js-list-results');
let serie = '';
let results = [];


console.log('>> Ready :)');

function clickHandler(ev) {
  ev.preventDefault();
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

function printResults() {
  for(let i = 0; i < results.length; i++) {
    resultList.innerHTML += `<li class="serie-container"> 
    <h2>${results[i].show.name}</h2>
    <img src="${results[i].show.image.medium}" alt="${results[i].show.name}">
    </li>`;
    // resultList.innerHTML += `<h2>${results[i].show.name}</h2>`;
    // resultList.innerHTML +=  `<img src="${results[i].show.image.medium}" alt="${results[i].show.name}">`
    // resultList.innerHTML += `</li>`;
  }

}

searchButton.addEventListener('click', clickHandler);