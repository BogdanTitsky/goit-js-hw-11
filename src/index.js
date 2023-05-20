import './css/style.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY = 'key=36489495-4c4bba821fe5c27fc94c3b861';
const PER_PAGE = 40;
let currentPage = 1;
const initialPage = 1;

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnShowMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', clickSubmit);
btnShowMore.addEventListener('click', clickShowMore);

async function clickSubmit(e) {
  e.preventDefault();

  const query = searchQuery.value;
  currentPage = initialPage;

  try {
    const resp = await axios.get(
      `https://pixabay.com/api/?${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${PER_PAGE}`
    );

    const imagesArr = resp.data.hits;

    if (imagesArr.length === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const totalHits = resp.data.totalHits;

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    gallery.innerHTML = makeMarkup(imagesArr);
    initializeLightbox();
  } catch (error) {
    console.error(error);
  }

  btnShowMore.classList.remove('hidden');
}

async function clickShowMore(e) {
  e.preventDefault();
  const query = searchQuery.value;
  currentPage++;

  try {
    const resp = await axios.get(
      `https://pixabay.com/api/?${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${PER_PAGE}`
    );

    const totalHits = resp.data.totalHits;
    console.log(totalHits);

    const imagesArr = resp.data.hits;

    if (imagesArr.length === 0) {
      btnShowMore.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.insertAdjacentHTML('beforeend', makeMarkup(imagesArr));
    initializeLightbox();

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (currentPage >= totalPages) {
      btnShowMore.classList.add('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      btnShowMore.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

function makeMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
      <a href="${webformatURL}" class="photo-card">
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
      </a>`
    )
    .join('');
}

function initializeLightbox() {
  const lightbox = new simpleLightbox('.gallery a');
}
