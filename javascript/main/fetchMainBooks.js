// API 요청 및 데이터 처리 함수
async function fetchBooks(query, maxResults, start = 1) {
  const url = `http://localhost:3000/itemlist?query=${query}&maxResults=${maxResults}&start=${start}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error(`Error fetching books for query "${query}":`, error);
    return [];
  }
}

// DOM 업데이트 함수
function updateBooksSection(books, containerSelector) {
  const booksContainer = document.querySelector(containerSelector);
  booksContainer.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.innerHTML = `
      <a href="${book.link}">
        <img src="${book.cover}" alt="${book.title}" />
        <p class="book-title">${book.title}</p>
      </a>
    `;
    booksContainer.appendChild(bookElement);
  });
}

// 블로거 베스트셀러
async function fetchBloggerBestSellers() {
  const books = await fetchBooks("BlogBest", 5);
  updateBooksSection(books, ".blogger-best-seller .books");
}

// 신간 도서
async function fetchNewBooks() {
  const books = await fetchBooks("ItemNewAll", 5);
  updateBooksSection(books, ".new-books .books");
}

// 주목할 만한 신간
async function fetchSpecialBooks() {
  const books = await fetchBooks("ItemNewSpecial", 4, 6);
  updateBooksSection(books, ".picks .books");
}

// 초기화면 로드
document.addEventListener("DOMContentLoaded", async () => {
  showLoading();
  try {
    await Promise.all([
      fetchBloggerBestSellers(),
      fetchNewBooks(),
      fetchSpecialBooks(),
    ]);
  } catch (error) {
    console.error("오류 발생:", error);
  } finally {
    hideLoading();
  }
});

// 로딩 화면을 보여주는 함수
function showLoading() {
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.style.display = "flex";
}

// 로딩 화면을 숨기는 함수
function hideLoading() {
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.style.display = "none";
}
