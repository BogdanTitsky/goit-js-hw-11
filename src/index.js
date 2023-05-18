import './css/style.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const KEY = 'key=36489495-4c4bba821fe5c27fc94c3b861';
const PER_PAGE = 40;
let currentPage = 1;

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnShowMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', clickSubmit);
btnShowMore.addEventListener('click', clickShowMore);

async function clickSubmit(e) {
  e.preventDefault();

  const query = searchQuery.value;

  try {
    const resp = await axios.get(
      `https://pixabay.com/api/?${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`
    );

    const imagesArr = resp.data.hits;

    if (imagesArr.length === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML = makeMarkup(imagesArr);
  } catch (error) {
    console.error(error);
  }

  btnShowMore.classList.remove('hidden');
}

async function clickShowMore(e) {}

function makeMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`
    )
    .join('');
}

// https://pixabay.com/api/?${KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true
