import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { Spinner } from 'spin.js';

const formEl = document.querySelector('.js-search-form');
const listEl = document.querySelector('.js-gallery');
const loadMoreBtn = document.querySelector('.js-load-more');
const spinnerContainer = document.querySelector('.js-backdrop');


const opts = {
  lines: 10, // The number of lines to draw
  length: 38, // The length of each line
  width: 7, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1.15, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#ffffff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

const spinner = new Spinner(opts);
// spinner.spin(spinnerContainer);

let query = null;
let page = 1;

const getPhotos = (query, page) => {
  axios.defaults.baseURL = 'https://api.unsplash.com';
  axios.defaults.headers.common['Authorization'] =
    'Client-ID LxvKVGJqiSe6NcEVZOaLXC-f2JIIWZaq_o0WrF8mwJc';
  return axios.get('/search/photos', {
    params: {
      query,
      page,
      per_page: 12,
      orientation: 'portrait',
    },
  });
};

const createMarkUp = array => {
  return array
    .map(
      photo => `
    <li class='gallery__item'>
       <img src='${photo.urls.small}' alt='${photo.alt_description}' class='gallery-img' />
     </li>
   `
    )
    .join('');
};

const spinnerPlay = () => {
    spinnerContainer.classList.remove('is-hidden');
    spinner.spin(spinnerContainer);
}

const spinnerStop = () => {
    spinnerContainer.classList.add('is-hidden');
    spinner.stop();
}

const handleSubmit = async event => {
  event.preventDefault();
  spinnerPlay();

  query = event.currentTarget.elements['user-search-query'].value.trim();

  if (!query) {
    return iziToast.warning({
      position: 'center',
      message: 'Empty query',
    });
  }

  try {
    const {
      data: { results, total, total_pages },
    } = await getPhotos(query, page);
    if (results.length === 0) {
      listEl.innerHTML = '';

      return iziToast.error({
        position: 'center',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    }
    listEl.innerHTML = createMarkUp(results);
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
};



formEl.addEventListener('submit', handleSubmit);
