import { formEl, listEl, loadMoreBtn } from './js/refs';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { spinnerPlay, spinnerStop } from './js/spinner';
import { getPhotos } from './js/usplashAPI';
import { createMarkUp } from './js/createMarkUp';
import { hasMoreData } from './js/hasMoreData';
import { onScroll } from './js/onScroll';

let query = null;
let page = 1;

const handleSubmit = async event => {
  event.preventDefault();
  spinnerPlay();
  page = 1;
  query = event.currentTarget.elements['user-search-query'].value.trim();

  if (!query) {
    spinnerStop();
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
      loadMoreBtn.classList.add('is-hidden');
      return iziToast.error({
        position: 'center',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    }
    iziToast.success({
      position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
      message: `"Hooray! We found ${total} images."`,
    });

    listEl.innerHTML = createMarkUp(results);

    hasMoreData(total_pages, page);
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
};

const handleMoreData = async () => {
  page += 1;
  spinnerPlay();

  try {
    const {
      data: { results, total_pages },
    } = await getPhotos(query, page);

    listEl.insertAdjacentHTML('beforeend', createMarkUp(results));
    // Функція для скролу
    onScroll();

    hasMoreData(total_pages, page);
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
};

formEl.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleMoreData);
