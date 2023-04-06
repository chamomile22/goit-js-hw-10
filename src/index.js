import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputCountry = document.querySelector('input#search-box');
const countriesList = document.querySelector('.country-list');
const countriesInfo = document.querySelector('.country-info');

inputCountry.addEventListener(
  'input',
  debounce(event => {
    if (event.target.value.trim() === '') {
      countriesList.innerHTML = '';
      countriesInfo.innerHTML = '';
      return;
    }
    fetchCountries(event.target.value)
      .then(data => {
        handleInputCountriesValue(data);
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countriesList.innerHTML = '';
        countriesInfo.innerHTML = '';
      });
  }, DEBOUNCE_DELAY)
);

function handleInputCountriesValue(value) {
  if (value.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countriesList.innerHTML = '';
    countriesInfo.innerHTML = '';
  }
  if (value.length >= 2 && value.length <= 10) {
    countriesInfo.innerHTML = '';
    const markup = value
      .map(el => {
        return `<li class="country-list__item">
        <img src="${el.flags.svg}" alt="flag-${el.name.official}" width="30"/>
      ${el.name.official}
    </li>`;
      })
      .join('');
    countriesList.innerHTML = markup;
  }
  if (value.length === 1) {
    countriesList.innerHTML = '';
    const markup = `<div class="country-name">
        <img src="${value[0].flags.svg}" alt="flag-${
      value[0].name.official
    }" width="30"/>
        <p>${value[0].name.official}</p>
      </div>
      <p><span class="field-name">Capital: </span>${value[0].capital}</p>
      <p><span class="field-name">Population: </span>${value[0].population}</p>
      <p><span class="field-name">Languages: </span>${renderLanguages(
        value[0].languages
      )
        .map(lang => `${lang}`)
        .join(', ')}</p>`;
    countriesInfo.innerHTML = markup;
  }
}

function renderLanguages(languages) {
  const langArr = Object.values(languages);
  return langArr;
}
