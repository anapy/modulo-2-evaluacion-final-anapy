'use strict';

const searchButton = document.querySelector('.js-search');
const serieInput = document.querySelector('.js-serie');
const resultList = document.querySelector('.js-list-results');
const favouriteList = document.querySelector('.js-favourite-list');
const resetBtn = document.querySelector('.js-reset-button');
let crossBtn = document.querySelectorAll('.js-cross-button');
let savedFavourites = JSON.parse(localStorage.getItem('localFavorites'));
let serie = '';
let results = [];
let apiData = [];
let resultItems = [];
let favourites = [];
let favouriteItems = [];

function clickHandler(ev) {
  ev.preventDefault();
  cleanResults(resultItems);
  serie = serieInput.value;
  getApiData();
}

function getApiData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${serie}`)
    .then(response => response.json())
    .then(data => {
      apiData = data;
      dataFilter();
      printResults();
    });
}

function dataFilter() {
  results = [];
  for(let i = 0; i < apiData.length; i++) {
    let aux = {};
    aux.id = apiData[i].show.id;
    aux.name = apiData[i].show.name;
    checkImg(apiData, i, aux);
    aux.listId = 'results';
    results.push(aux);
  }
}

//print the series given by the api
//creates the elements by DOM appending to ul tag each li with its proper content
function printResults() {
  if(results.length === 0) {
    const error = document.createElement('h2');
    error.classList.add('error');
    const errorContent = document.createTextNode('La serie buscada no está en nuestro listado, prueba de nuevo');
    error.appendChild(errorContent);
    resultList.appendChild(error);
  } else {
    generateHTML(results, resultList);
    resultItems = document.querySelectorAll('.js-serie-container');
    createEventListener(resultItems, handlerClickfavourite);
  }
}


//clean the last result removing all child from the ul tag or the error message
function cleanResults (items) {
  for(const child of items) {
    resultList.removeChild(child);
  }
  const error = document.querySelector('.error');
  if(error !== null) {
    resultList.removeChild(error);
  }
}

//checkImg checks whether is an image on the results array or the image attribute is empty//
function checkImg(list, index, item) {
  if(list[index].show.image === null) {
    item.image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  } else {
    item.image = list[index].show.image.medium;
  }
}

//add the event listener for clicking series
function createEventListener(lists, handler) {
  for(const item of lists) {
    item.addEventListener('click', handler);
  }
}


function handlerClickfavourite(ev) {
  let clickedItem = ev.currentTarget.id;
  cleanFavourites(favouriteItems);
  //check if the new item is already at favourites
  const repeat = favourites.findIndex(favourite => favourite.id === parseInt(clickedItem));

  // //add to favourites the new series or remove the series already on favourites
  if(repeat === -1) {
    const newFav = results.find(result => result.id === parseInt(clickedItem));
    newFav.listId = 'favourite';
    favourites.push(newFav);
  } else {
    favourites.splice(repeat,1);
  }
  highlightFavourites(clickedItem);

  generateHTML(favourites, favouriteList);
  favouriteItems = document.querySelectorAll('.js-serie-container-small');
  localStorage.setItem('localFavorites', JSON.stringify(favourites));
  crossBtn = document.querySelectorAll('.js-cross-button');
  savedFavourites = JSON.parse(localStorage.getItem('localFavorites'));
  createEventListener(crossBtn, deleteOne);
}

function cleanFavourites (items) {
  for(const child of items) {
    favouriteList.removeChild(child);
  }
}

function generateHTML(list, listcontainer) {
  for(let i = 0; i < list.length; i++) {
    //creating li
    const newLi = document.createElement('li');
    //giving different class and atributte for li
    if(list[i].listId === 'results') {
      newLi.classList.add('serie-container', 'js-serie-container');
      newLi.setAttribute('id', list[i].id);
    } else {
      newLi.classList.add('serie-container-small', 'js-serie-container-small');
      newLi.setAttribute('id', `fav${list[i].id}`);
    }
    if(list[i].listId === 'favourite') {
    //button only for favourites
      const libutton = document.createElement('button');
      libutton.classList.add('cross-button', 'js-cross-button');
      libutton.setAttribute('id', list[i].id);
      const cross = document.createElement('i');
      cross.classList.add('fas');
      cross.classList.add('fa-times');
      libutton.appendChild(cross);
      newLi.appendChild(libutton);
    }
    //creating li title
    //giving different title tag by ternari operator
    const liTitle = list[i].listId === 'results' ? document.createElement('h2') : document.createElement('h3');
    liTitle.classList.add('serie-title');
    const liTitleContent = document.createTextNode(list[i].name);
    liTitle.appendChild(liTitleContent);
    newLi.appendChild(liTitle);
    //creating li img
    const liImg = document.createElement('IMG');
    liImg.setAttribute('src', list[i].image);
    liImg.setAttribute('alt', list[i].name);
    if(list[i].listId === 'favourite') {
      liImg.setAttribute('height', '100px');
    }
    if((favourites !== null) && (list[i].listId === 'results')){
      let savedFav = favourites.findIndex(favourite => favourite.id === list[i].id);
      if(savedFav !== -1) {
        newLi.classList.add('js-favourite');
      }
    }
    newLi.appendChild(liImg);
    listcontainer.appendChild(newLi);
  }
}

//highlight with a different background and color
function highlightFavourites(clicked) {
  let newFavourite = document.getElementById(`${clicked}`);
  if(newFavourite !== null) {
    //marca o desmarca añadiendo la clase o quitándola del elemento
    newFavourite.classList.toggle('js-favourite');
  }
}

function recoverData() {
  if((savedFavourites.length !== 0) && (savedFavourites !== null)) {
    favourites = savedFavourites;
    generateHTML(favourites, favouriteList);
    crossBtn = document.querySelectorAll('.js-cross-button');
    createEventListener(crossBtn, deleteOne);
    favouriteItems = document.querySelectorAll('.js-serie-container-small');
    resultItems = document.querySelectorAll('.js-serie-container');
    localStorage.setItem('localFavorites', JSON.stringify(favourites));
  }
}

function resetFav() {
  crossBtn = document.querySelectorAll('.js-cross-button');
  cleanFavourites(favouriteItems);
  for(let item of resultItems) {
    item.classList.remove('js-favourite');
  }
  favouriteItems = [];
  favourites = [];
  localStorage.clear();
  savedFavourites = favourites;
}

function deleteOne(ev) {
  handlerClickfavourite(ev);
}

document.addEventListener('DOMContentLoaded', recoverData);
searchButton.addEventListener('click', clickHandler);
resetBtn.addEventListener('click', resetFav);


//animations

const showHeader = () => {
  const header = document.querySelector('.header');
  const front = document.querySelector('.start-container');
  header.classList.remove('hidden');
  header.classList.add('animate__animated', 'animate__zoomIn');
  front.classList.add('hidden');
};


setTimeout(showHeader, 3000);