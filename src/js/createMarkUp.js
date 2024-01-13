export const createMarkUp = array => {
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
