import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput() {
  const name = searchInput.value.trim();
  if (!name.trim()) {
    return;
  }
  fetchCountries(name)
    .then(counrties => {
      clearInput();
      inputCheck(counrties);
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
      clearInput();
    });
}

function renderList(counrties) {
  return counrties
    .map(({ name, flags }) => {
      return `<li class='country-list__item'>
    <img src="${flags.svg}" alt="${name.official}" width = 30px >
    <h2 class="country-list__name">${name.official}</h2></li>`;
    })
    .join('');
}

function renderInfo(counrties) {
  return counrties
    .map(({ capital, population, languages }) => {
      return `<ul class="list">
              <li>Capital: ${capital}</li>
              <li>Population: ${population}</li>
              <li>Languages: ${Object.values(languages).join(', ')}</li>
              </ul>`;
    })
    .join('');
}

function inputCheck(counrties) {
  if (counrties.length === 1) {
    countryList.insertAdjacentHTML('beforeend', renderList(counrties));
    countryInfo.insertAdjacentHTML('beforeend', renderInfo(counrties));
  } else if (counrties.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (counrties.length >= 2 && counrties.length <= 10) {
    countryList.insertAdjacentHTML('beforeend', renderList(counrties));
  }
}

function clearInput() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
