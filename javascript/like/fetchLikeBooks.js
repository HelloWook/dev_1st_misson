// 좋아요 한 책들을 출력하는 함수
function displayLikedBooks() {
  const savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  const booksContainer = document.querySelector(".book-items");
  booksContainer.innerHTML = "";

  const resultCountElement = document.querySelector(".result-count");
  resultCountElement.textContent = savedBooks.length;

  if (savedBooks.length > 0) {
    savedBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      booksContainer.appendChild(bookElement);
    });
  } else {
    const noDataElement = document.createElement("div");
    noDataElement.classList.add("no-data");
    noDataElement.innerHTML = `<span>좋아요한 책이 없습니다.</span>`;
    booksContainer.appendChild(noDataElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayLikedBooks();
});

function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");

  bookElement.innerHTML = `
    <div class="book-cover">
      <img src="${book.cover || "../../public/image 24.png"}" alt="${
    book.title || "책"
  }" />
      <div class="book-overlay">
        <svg viewBox="0 0 24 24" width="25" height="25" fill="red" class="heart-icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <div class="info-icon">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="16" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="6" r="1" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
    <p class="book-title">${book.title || "제목 없음"}</p>
    <p class="book-author">${book.author || "저자 미상"}</p>`;

  // 하트 아이콘 클릭 시 좋아요 상태 토글
  const heartIcon = bookElement.querySelector(".heart-icon");
  heartIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleLike(book);
    displayLikedBooks();
  });

  bookElement.addEventListener("click", () => openModal(book));

  return bookElement;
}

function isBookLiked(book) {
  const savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  return savedBooks.some((savedBook) => savedBook.title === book.title);
}

// 좋아요 토글 함수
function toggleLike(book) {
  let savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];

  if (isBookLiked(book)) {
    savedBooks = savedBooks.filter(
      (savedBook) => savedBook.title !== book.title
    );
    alert("좋아요가 취소되었습니다.");
  } else {
    savedBooks.push(book);
    alert("책이 저장되었습니다.");
  }

  localStorage.setItem("savedBooks", JSON.stringify(savedBooks));
}

// 모달 열기 함수
function openModal(book) {
  const overlay = document.querySelector(".overlay");
  const modal = overlay.querySelector(".modal");

  modal.querySelector(".book-image img").src =
    book.cover || "../../public/image 24.png";
  modal.querySelector(".title").textContent = book.title || "제목 없음";
  modal.querySelector(".author").textContent = `저자: ${
    book.author || "저자 미상"
  }`;
  modal.querySelector(".publisher").textContent = `출판사: ${
    book.publisher || "출판사 미상"
  }`;
  modal.querySelector(".price").textContent = `${
    book.priceSales || "가격 정보 없음"
  }`;
  modal.querySelector(".rating").textContent = `⭐ ${
    book.customerReviewRank || "평점 없음"
  }`;
  modal.querySelector(".description").textContent =
    book.description || "설명이 없습니다.";
  modal.querySelector(".modal-footer a").href = book.link || "#";

  overlay.style.display = "flex";

  document.querySelector(".close-btn").addEventListener("click", closeModal);
}

// 모달 닫기 함수
function closeModal() {
  const overlay = document.querySelector(".overlay");
  overlay.style.display = "none";
}
