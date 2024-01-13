import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { loadMoreBtn } from './refs';

export const hasMoreData = (lastPage, page) => {
  if (page < lastPage) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    iziToast.info({
      position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
      message: "We're sorry, but you've reached the end of search results.",
    });
    loadMoreBtn.classList.add('is-hidden');
  }
};
