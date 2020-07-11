'use strict';

const searchButton = document.querySelector('.js-search');
const serieInput = document.querySelector('.js-serie');
const resultList = document.querySelector('.js-list-results');
const favouriteList = document.querySelector('.js-favourite-list');
let serie = '';
let results = [];
let result = [];
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
      result = data;
      dataFilter(result, results);
      //printResults();
    });
}

function dataFilter(info, infoResult) {
  for(let i = 0; i < info.length; i++) {
    let aux = {};
    aux.id = info[i].show.id;
    aux.name = info[i].show.name;
    checkImgFirst(info, i);
    infoResult.push(aux);
  }
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
    generateHTML(results, resultList);
    resultItems = document.querySelectorAll('.serie-container');
    createEventListener(resultItems);
  }
}


//clean the last result removing all child from the ul tag or the error message
function cleanResults (items) {
  for(const child of items) {
    resultList.removeChild(child);
  }
  const errors = document.querySelector('.error');
  if(errors !== null) {
    resultList.removeChild(errors);
  }
}

//checkImg checks whether is an image on the results array//
function checkImg(list, index, item) {
  if(list[index].show.image === null) {
    item.setAttribute('src', 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
  } else {
    item.setAttribute('src', list[index].show.image.medium);
  }
}

//checkImg checks whether is an image on the results array//
function checkImgFirst(list, index) {
  if(list[index].show.image === null) {
    list[index].image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  } else {
    list[index].image = list[index].show.image.medium;
  }
}

//add the event listener for clicking series
function createEventListener(lists) {
  for(const item of lists) {
    item.addEventListener('click', handlerClickfavourite);
  }
}

function handlerClickfavourite(ev) {
  let clickedItem = ev.currentTarget.id;
  cleanFavourites(favouriteItems);
  //check if the new item is already at favourites
  const repeat = favourites.findIndex(favourite => favourite.show.id === parseInt(clickedItem));

  // //add to favourites the new series or remove the series already on favourites
  if(repeat === -1) {
    favourites.push(results.find(result => result.show.id === parseInt(clickedItem)));
    highlightFavourites(clickedItem);
  } else {
    highlightFavourites(clickedItem);
    favourites.splice(repeat,1);
  }
  for(let i = 0; i < favourites.length; i++) {
    //creating li
    const newLi = document.createElement('li');
    newLi.classList.add('serie-container-small');
    newLi.setAttribute('id', `fav${favourites[i].show.id}`);
    //creating X button
    const libutton = document.createElement('button');
    libutton.classList.add('cross-button');
    const cross = document.createElement('i');
    cross.classList.add('fas');
    cross.classList.add('fa-times');
    libutton.appendChild(cross);
    newLi.appendChild(libutton);
    //creating li title
    const liTitle = document.createElement('h2');
    liTitle.classList.add('serie-title');
    const liTitleContent = document.createTextNode(favourites[i].show.name);
    liTitle.appendChild(liTitleContent);
    newLi.appendChild(liTitle);
    //creating li img
    const liImg = document.createElement('IMG');
    checkImg(favourites, i, liImg);
    liImg.setAttribute('alt', favourites[i].show.name);
    liImg.setAttribute('height', '100px');
    newLi.appendChild(liImg);
    favouriteList.appendChild(newLi);
  }
  favouriteItems = document.querySelectorAll('.serie-container-small');
  resultItems = document.querySelectorAll('.serie-container');
  localStorage.setItem('localFavorites', JSON.stringify(favourites));
}

function cleanFavourites (items) {
  for(const child of items) {
    favouriteList.removeChild(child);
  }
}

function generateHTML(items, listcontainer) {
  for(let i = 0; i < items.length; i++) {
    //creating li
    const newLi = document.createElement('li');
    newLi.classList.add('serie-container');
    newLi.setAttribute('id', items[i].show.id);
    //creating li title
    const liTitle = document.createElement('h2');
    liTitle.classList.add('serie-title');
    const liTitleContent = document.createTextNode(items[i].show.name);
    liTitle.appendChild(liTitleContent);
    newLi.appendChild(liTitle);
    //creating li img
    const liImg = document.createElement('IMG');
    checkImg(items, i, liImg);
    liImg.setAttribute('alt', items[i].show.name);
    newLi.appendChild(liImg);
    listcontainer.appendChild(newLi);
  }
}

//highlight with a different background and color
function highlightFavourites(clicked) {
  let newFavourite = document.getElementById(`${clicked}`);
  //marca o desmarca añadiendo la clase o quitándola del elemento
  newFavourite.classList.toggle('js-favourite');
}

function recoverData() {
  const savedFavourites = JSON.parse(localStorage.getItem('localFavorites'));
  if(savedFavourites.length !== 0) {
    favourites = savedFavourites;
    for(let i = 0; i < favourites.length; i++) {
      const newLi = document.createElement('li');
      newLi.classList.add('serie-container-small');
      newLi.setAttribute('id', `fav${favourites[i].show.id}`);
      //creating X button
      const libutton = document.createElement('button');
      libutton.classList.add('cross-button');
      const cross = document.createElement('i');
      cross.classList.add('fas');
      cross.classList.add('fa-times');
      libutton.appendChild(cross);
      newLi.appendChild(libutton);
      //creating li title
      const liTitle = document.createElement('h2');
      liTitle.classList.add('serie-title');
      const liTitleContent = document.createTextNode(favourites[i].show.name);
      liTitle.appendChild(liTitleContent);
      newLi.appendChild(liTitle);
      //creating li img 
      const liImg = document.createElement('IMG');
      checkImg(favourites, i, liImg);
      liImg.setAttribute('alt', favourites[i].show.name);
      liImg.setAttribute('height', '100px');
      newLi.appendChild(liImg);
      favouriteList.appendChild(newLi);
    }
    favouriteItems = document.querySelectorAll('.serie-container-small');
    resultItems = document.querySelectorAll('.serie-container');
    localStorage.setItem('localFavorites', JSON.stringify(favourites));
  }
}

document.addEventListener('DOMContentLoaded', recoverData);
searchButton.addEventListener('click', clickHandler);