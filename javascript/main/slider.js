async function fetchBestseller() {
  try {
    const response = await fetch(
      "http://localhost:3000/itemlist?query=Bestseller&maxResults=50"
    );
    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error("존재하지 않는 데이터입니다.:", error);
    return [];
  }
}

async function init() {
  const books = await fetchBestseller();

  if (!books || books.length === 0) {
    console.error("책이 없습니다.");
    return;
  }

  const sliderWrapper = document.querySelector(".slide-wapper");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let slides;
  let idx = 1;

  function selectBook(choice) {
    const selectSlide = document.createElement("div");
    selectSlide.classList.add("select-slide");
    selectSlide.innerHTML = `
      <img src="${books[choice].cover}" alt="선택된 책" />
      <div class="slide-info">
        <p class="slide-title">${books[choice].title}</p>
        <p class="slide-author">${books[choice].author}</p>
        <p class="slide-price"><span class="highlight">판매가: </span>${books[
          choice
        ].priceSales.toLocaleString()}원</p>
        <p class="slide-summary">${
          books[choice].description || "설명이 없습니다."
        }</p>
      </div>
    `;
    sliderWrapper.appendChild(selectSlide);
  }

  function loadSlider() {
    const slideContainer = document.createElement("div");
    slideContainer.classList.add("slide-container");
    slides = document.createElement("div");
    slides.classList.add("slide-list");

    books.forEach((book, i) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("slide");
      bookItem.innerHTML = `
        <img src="${book.cover}" alt="책" />
        <p class="slide-title">${book.title}</p>
      `;
      slides.appendChild(bookItem);
    });

    slideContainer.appendChild(slides);
    sliderWrapper.appendChild(slideContainer);
    slides.style.transform = `translateX(-173px)`;
  }

  function appendSlider() {
    const slideList = document.querySelector(".slide-list");
    books.forEach((book) => {
      const cloneSlide = slideList.children[0].cloneNode(true);
      slideList.appendChild(cloneSlide);
    });
  }

  function removeAppendedSlides() {
    const slideList = document.querySelector(".slide-list");

    while (slideList.children.length > books.length) {
      slideList.removeChild(slideList.lastElementChild);
    }
  }
  function changeBook(choice) {
    const selectSlide = document.createElement("div");
    selectSlide.classList.add("select-slide");
    selectSlide.innerHTML = `
        <img src="${books[choice].cover}" alt="선택된 책" />
        <div class="slide-info">
          <p class="slide-title">${books[choice].title}</p>
          <p class="slide-author">${books[choice].author}</p>
          <p class="slide-price"><span class="highlight">판매가: </span>${books[
            choice
          ].priceSales.toLocaleString()}원</p>
          <p class="slide-summary">${
            books[choice].description || "설명이 없습니다."
          }</p>
        </div>
      `;
    const oldSlide = document.querySelector(".select-slide");
    sliderWrapper.replaceChild(selectSlide, oldSlide);
  }

  function SliderMove() {
    let position = -173;
    let isPaste = false;

    function prev() {
      idx--;
      position += 173;
      slides.style.transition = `transform 0.5s ease-in-out`;
      slides.style.transform = `translateX(${position}px)`;
      changeBook(idx > 0 ? idx - 1 : books.length - 1);
      if (idx === 0 && isPaste === false) {
        appendSlider();
        isPaste = true;
      } else if (idx === -1) {
        changeBook(books.length - 2);
        if (isPaste === false) {
          appendSlider();
          isPaste = true;
        }
        setTimeout(() => {
          idx = books.length - 1;
          slides.style.transition = `transform 0s`;
          position = -173 * (books.length - 1);
          slides.style.transform = `translateX(-${(books.length - 1) * 173}px)`;
        }, 500);
      } else if (idx === 1 && isPaste === true) {
        setTimeout(() => {
          slides.style.transition = `transform 0s`;
          removeAppendedSlides();
          isPaste = false;
        }, 500);
      }
    }

    function next() {
      idx++;
      position -= 173;
      slides.style.transition = `transform 0.5s ease-in-out`;
      slides.style.transform = `translateX(${position}px)`;
      changeBook(idx !== 0 ? idx - 1 : books.length - 1);
      if (idx > books.length - 3 && isPaste === false) {
        appendSlider();
        isPaste = true;
      }
      if (idx === books.length) {
        setTimeout(() => {
          idx = 0;
          position = 0;
          slides.style.transition = `transform 0s`;
          slides.style.transform = `translateX(0px)`;
          removeAppendedSlides();
          isPaste = false;
        }, 500);
      }
    }

    return {
      prev,
      next,
    };
  }

  selectBook(idx - 1);
  loadSlider();

  const positioning = SliderMove();
  nextBtn.addEventListener("click", positioning.next);
  prevBtn.addEventListener("click", positioning.prev);
}

document.addEventListener("DOMContentLoaded", init);
