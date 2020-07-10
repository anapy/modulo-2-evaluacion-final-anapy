'use strict';

const searchButton = document.querySelector('.js-search');
const serieInput = document.querySelector('.js-serie');
let resultList = document.querySelector('.js-list-results');
let serie = '';
let results = [];
let favourites = [];
let listItems = [];

function clickHandler(ev) {
  ev.preventDefault();
  cleanResults(listItems);
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
      newLi.setAttribute('id', results[i].show.id);
      const liTitle = document.createElement('h2');
      liTitle.classList.add('serie-title');
      const liTitleContent = document.createTextNode(results[i].show.name);
      liTitle.appendChild(liTitleContent);
      newLi.appendChild(liTitle);
      const liImg = document.createElement('IMG');
      checkImg(i, liImg);
      liImg.setAttribute('alt', results[i].show.name);
      newLi.appendChild(liImg);
      resultList.appendChild(newLi);
    }
    listItems = document.querySelectorAll('.serie-container');
    createEventListener(listItems);
  }
}

//clean the last result removing all child from the ul tag or the error message
function cleanResults (items) {
  //const listItems = document.querySelectorAll('.serie-container');
  for(const child of items) {
    resultList.removeChild(child);
  }
  const errors = document.querySelector('.error');
  if(errors !== null) {
    resultList.removeChild(errors);
  }
}

//checkImg checks whether is an image on the result array//
function checkImg(index, item) {
  if(results[index].show.image === null) {
    item.setAttribute('src', 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
  } else {
    item.setAttribute('src', results[index].show.image.medium);
  }
}

function createEventListener(lists) {
  for(const item of lists) {
    item.addEventListener('click', clickfavourite);
  }
}

function clickfavourite(ev) {
  let clickedItem = ev.currentTarget.id;
  //añade a favoritos las series seleccionadas
  favourites.push(results.find(result => result.show.id === parseInt(clickedItem)));
  highlightFavourites(clickedItem);
}

//highlight with a different 
function highlightFavourites(clicked) {
  let newFavourite = document.getElementById(`${clicked}`);
  //marca o desmarca añadiendo la clase o quitándola del elemento
  newFavourite.classList.toggle('js-favourite');
}

searchButton.addEventListener('click', clickHandler);