let startPosition = 1;
let sort = "Accuracy";

document.addEventListener("DOMContentLoaded", async () => {
  showLoading();

  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  const option = params.get("option");

  const queryType = getQueryType(option);

  try {
    await initializePage(query, queryType);

    setupPaginationListeners(query, queryType);
    setupSortListeners(query, queryType);
  } catch (error) {
    console.error("오류 발생:", error);
  } finally {
    hideLoading();
  }
});

// 검색 옵션에 따른 queryType 설정
function getQueryType(option) {
  switch (option) {
    case "도서명으로 검색":
      return "Title";
    case "작가명으로 검색":
      return "Author";
    default:
      console.error("유효한 검색 옵션이 아닙니다.");
      return null;
  }
}

// 초기 페이지 설정 및 데이터 가져오기
async function initializePage(query, queryType) {
  const apiUrl = createApiUrl(query, queryType, startPosition, 10, sort);
  await fetchAndRenderBooks(apiUrl, query, queryType);
}

// 검색 정보 업데이트
function updateSearchInfo(query, totalResults) {
  const searchInfoElement = document.querySelector(".search-title");
  searchInfoElement.querySelector(".highlight").textContent = query;
  searchInfoElement.querySelector(".result-count").textContent = totalResults;
}

// API URL 생성
function createApiUrl(
  query,
  queryType,
  start,
  maxResults = 10,
  sort = "Accuracy"
) {
  return `http://localhost:3000/search?query=${encodeURIComponent(
    query
  )}&queryType=${queryType}&start=${start}&maxResults=${maxResults}&sort=${sort}`;
}

// 데이터 요청 후 렌더링
async function fetchAndRenderBooks(apiUrl, query, queryType) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("API 데이터:", data);

    if (data.totalResults > 0 && data.item && data.item.length > 0) {
      updateSearchInfo(query, data.totalResults);
      updateBooks(data, query, queryType);
      pageNation(startPosition, data.totalResults, query, queryType);
    } else {
      updateSearchInfo(query, 0);
      document.querySelector(".book-items").innerHTML = `
        <div class="no-data">
          <span>데이터가 존재하지 않습니다.</span>
        </div>`;
    }
  } catch (error) {
    console.error("API 요청 실패:", error);
  }
}
// 모달 열기
function openModal(book, query, queryType) {
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

  updateHeartIconState(
    modal.querySelector(".heart-icon"),
    book,
    query,
    queryType
  );

  document.querySelector(".close-btn").addEventListener("click", closeModal);
  overlay.style.display = "flex";
}

// 모달 닫기
function closeModal() {
  document.querySelector(".overlay").style.display = "none";
}

// 하트 아이콘 상태 업데이트
function updateHeartIconState(heartIcon, book, query, queryType) {
  const savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  const isBookSaved = savedBooks.some(
    (savedBook) => savedBook.title === book.title
  );

  heartIcon.setAttribute("fill", isBookSaved ? "red" : "gray");

  heartIcon.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isBookSaved) {
      removeFromLocalStorage(book);
      heartIcon.setAttribute("fill", "gray");
    } else {
      saveToLocalStorage(book);
      heartIcon.setAttribute("fill", "red");
    }

    const apiUrl = createApiUrl(query, queryType, startPosition, 10, sort);
    fetchAndRenderBooks(apiUrl, query, queryType);
  });
}

// 로컬스토리지에 책 저장
function saveToLocalStorage(book) {
  let savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  if (savedBooks.length < 10) {
    savedBooks.push(book);
    localStorage.setItem("savedBooks", JSON.stringify(savedBooks));
    alert("책이 저장되었습니다.");
  } else {
    alert("최대 10개까지 저장이 가능합니다.");
  }
}

// 로컬스토리지에서 책 삭제
function removeFromLocalStorage(book) {
  let savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  savedBooks = savedBooks.filter((savedBook) => savedBook.title !== book.title);
  localStorage.setItem("savedBooks", JSON.stringify(savedBooks));
  alert("책이 삭제되었습니다.");
}

// 책 데이터 업데이트
function updateBooks(data, query, queryType) {
  const booksContainer = document.querySelector(".book-items");
  booksContainer.innerHTML = "";

  if (data.item && data.item.length > 0) {
    data.item.forEach((book) => {
      const bookElement = createBookElement(book, query, queryType);
      booksContainer.appendChild(bookElement);
    });
  }
}

// 책 요소 생성
function createBookElement(book, query, queryType) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");

  bookElement.innerHTML = `
    <div class="book-cover">
      <img src="${book.cover || "../../public/image 24.png"}" alt="${
    book.title || "책"
  }" />
      <div class="book-overlay">
        <svg viewBox="0 0 24 24" width="25" height="25" fill="white" class="heart-icon">
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

  updateHeartIconState(
    bookElement.querySelector(".heart-icon"),
    book,
    query,
    queryType
  );

  bookElement.addEventListener("click", () =>
    openModal(book, query, queryType)
  );

  return bookElement;
}

function pageNation(startPosition, totalResults, query, queryType) {
  const maxPage = Math.ceil(totalResults / 10);
  const btnList = document.querySelector(".button-list");

  btnList.innerHTML = "";

  if (maxPage - startPosition > 7) {
    createPaginationButtons(
      startPosition,
      startPosition + 6,
      maxPage,
      btnList,
      query,
      queryType
    );
    createDotAndLastPageButtons(btnList, maxPage, query, queryType);
  } else {
    createPaginationButtons(
      startPosition,
      maxPage,
      maxPage,
      btnList,
      query,
      queryType
    );
  }

  highlightActivePage(startPosition);
}

//페이지네이션 버튼
function createPaginationButtons(
  start,
  end,
  maxPage,
  btnList,
  query,
  queryType
) {
  for (let i = start; i <= end && i <= maxPage; i++) {
    const btnElement = createPageButton(i, query, queryType);
    btnList.appendChild(btnElement);
  }
}

function createDotAndLastPageButtons(btnList, maxPage, query, queryType) {
  const dotElement = document.createElement("button");
  dotElement.textContent = "...";
  btnList.appendChild(dotElement);

  const lastPageBtn = createPageButton(maxPage, query, queryType);
  btnList.appendChild(lastPageBtn);
}

function createPageButton(page, query, queryType) {
  const btnElement = document.createElement("button");
  btnElement.textContent = page;
  btnElement.setAttribute("data-page", page);

  btnElement.addEventListener("click", async () => {
    showLoading();
    startPosition = page;
    try {
      const apiUrl = createApiUrl(query, queryType, startPosition, 10, sort);
      await fetchAndRenderBooks(apiUrl, query, queryType);
      await highlightActivePage(page);
    } catch (error) {
      console.error("에러 발생", error);
    } finally {
      hideLoading();
    }
  });

  return btnElement;
}

// 선택된 버튼의 색상을 변경하는 함수
function highlightActivePage(page) {
  const allButtons = document.querySelectorAll(".button-list button");
  allButtons.forEach((btn) => btn.classList.remove("active"));

  const activeButton = document.querySelector(`button[data-page="${page}"]`);
  if (activeButton) activeButton.classList.add("active");
}

function setupPaginationListeners(query, queryType) {
  document
    .querySelector(".next")
    .addEventListener("click", () =>
      handlePaginationClick(1, query, queryType)
    );
  document
    .querySelector(".prev")
    .addEventListener("click", () =>
      handlePaginationClick(-1, query, queryType)
    );
}

async function handlePaginationClick(direction, query, queryType) {
  showLoading();
  startPosition += direction;
  if (startPosition < 1) startPosition = 1;

  const apiUrl = createApiUrl(query, queryType, startPosition, 10, sort);
  try {
    await fetchAndRenderBooks(apiUrl, query, queryType);
  } catch (error) {
    console.error("에러발생", error);
  } finally {
    hideLoading();
  }
}

function setupSortListeners(query, queryType) {
  document.querySelectorAll(".sort-menu button").forEach((button) => {
    button.addEventListener("click", () =>
      handleSortButtonClick(button, query, queryType)
    );
  });

  const resetButton = document.querySelector(".side-menu-titles span ");
  resetButton.addEventListener("click", async () => {
    sort = "Accuracy";
    startPosition = 1;

    try {
      await fetchAndRenderBooks(apiUrl, query, queryType);
    } catch (error) {
      console.error("에러발생", error);
    } finally {
      hideLoading();
    }

    document.querySelectorAll(".sort-menu button").forEach((btn) => {
      btn.classList.remove("active");
    });
  });
}

// 정렬 버튼 클릭
async function handleSortButtonClick(button, query, queryType) {
  showLoading();
  document
    .querySelectorAll(".sort-menu button")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  sort = getSortType(button.textContent);
  startPosition = 1;

  const apiUrl = createApiUrl(query, queryType, startPosition, 10, sort);
  try {
    await fetchAndRenderBooks(apiUrl, query, queryType);
  } catch (error) {
    console.error("에러 발생", error);
  } finally {
    hideLoading();
  }
}

// 정렬
function getSortType(text) {
  switch (text) {
    case "인기순":
      return "Accuracy";
    case "판매순":
      return "SalesPoint";
    case "최신순":
      return "PublishTime";
    case "상품명순":
      return "Title";
    case "평점순":
      return "CustomerRating";
    default:
      return "Accuracy";
  }
}

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
