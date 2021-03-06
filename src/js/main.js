'use strict';

const searchButton = document.querySelector('.js-search');
const serieInput = document.querySelector('.js-serie');
const resultList = document.querySelector('.js-list-results');
const favouriteList = document.querySelector('.js-favourite-list');
const resetBtn = document.querySelector('.js-reset-button');
const header = document.querySelector('.header');
const defaultBackground = document.querySelector('.js-show-start');
const arrowBtn = document.querySelector('.open_button')
const sectionFav = document.querySelector('.js-list');
let crossBtn = document.querySelectorAll('.js-cross-button');
let savedFavourites = JSON.parse(localStorage.getItem('localFavorites'));
let serie = '';
let results = [];
let apiData = [];
let resultItems = [];
let favourites = [];
let favouriteItems = [];
const buttonFavourites = document.querySelector('.js-show-favourites');


function clickHandler(ev) {
  ev.preventDefault();
  defaultBackground.classList.add('hidden');
  cleanHTML(resultItems, resultList);
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
    checkDays(apiData, i, aux)
    aux.listId = 'results';
    results.push(aux);
  }
}

function checkDays(list, index, item) {
  if(list[index].show.image === null) {
    item.days = '';
  } else {
    item.days = list[index].show.schedule.days;
  }
}

//print the series given by the api
//create the elements by DOM appending to ul tag each li with its proper content
function printResults() {
  if(results.length === 0) {
    inputError();
  } else {
    generateHTML(results, resultList);
    resultItems = document.querySelectorAll('.js-serie-container');
    createEventListener(resultItems, handlerClickfavourite);
  }
}

//generate the error message and add it to resultList
function inputError() {
  const error = document.createElement('h2');
  error.classList.add('js-error', 'error');
  const errorContent = document.createTextNode('Ops, we don\'t find any serie with that name. Try again!');
  error.appendChild(errorContent);
  resultList.appendChild(error);
  resultItems = document.querySelectorAll('.js-error');
}

//clean the last result removing all child from the ul tag or the error message
function cleanHTML (items, itemcontainer) {
  for(const child of items) {
    itemcontainer.removeChild(child);
  }
  const error = document.querySelector('.js-error');
  if(error !== null) {
    itemcontainer.removeChild(error);
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
  cleanHTML(favouriteItems, favouriteList);
  checkRepeatFavourites(clickedItem);
  highlightFavourites(clickedItem);
  generateHTML(favourites, favouriteList);
  favouriteItems = document.querySelectorAll('.js-serie-container-small');
  localStorage.setItem('localFavorites', JSON.stringify(favourites));
  crossBtn = document.querySelectorAll('.js-cross-button');
  savedFavourites = JSON.parse(localStorage.getItem('localFavorites'));
  createEventListener(crossBtn, deleteOne);
}

//check if the new item is already at favourites
function checkRepeatFavourites(clicked) {
  const repeat = favourites.findIndex(favourite => favourite.id === parseInt(clicked));
  //add to favourites the new series or remove the series already on favourites
  if(repeat === -1) {
    const newFav = results.find(result => result.id === parseInt(clicked));
    newFav.listId = 'favourite';
    favourites.push(newFav);
  } else {
    favourites.splice(repeat,1);
  }
}

//generates the HTML for main results and favourites
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
    //creating li days
    if(list[i].listId === 'results') {
      const liDays = document.createElement('p');
      liDays.classList.add('days');
      let liDaysContent = document.createTextNode('The serie is no more on TV');
      if((list[i].days.length !== 0)) {
        liDaysContent = document.createTextNode(list[i].days);
      }
      liDays.appendChild(liDaysContent);
      newLi.appendChild(liDays);
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
  const newFavourite = document.getElementById(`${clicked}`);
  if(newFavourite !== null) {
    //marca o desmarca añadiendo la clase o quitándola del elemento
    newFavourite.classList.toggle('js-favourite');
  }
}

function recoverData() {
  if((savedFavourites !== null) && (savedFavourites.length !== 0)) {
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
  cleanHTML(favouriteItems, favouriteList);
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
  header.classList.remove('hidden');
  header.classList.add('animate__animated', 'animate__zoomIn');
};

setTimeout(showHeader, 2500);

function arrowHandler() {
  sectionFav.classList.toggle('hidden');
}
arrowBtn.addEventListener('click', arrowHandler);