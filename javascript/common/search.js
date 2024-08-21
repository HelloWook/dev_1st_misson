document.addEventListener("DOMContentLoaded", function () {
  const selectBtns = document.querySelectorAll(".search-tag-list > button");
  let selectedOption = "도서명으로 검색";

  selectBtns.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedOption = button.textContent.trim();
    });
  });

  document
    .querySelector(".search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const searchInput = document.querySelector(".search-input");
      if (searchInput) {
        const searchQuery = searchInput.value.trim();
        if (searchQuery === "") {
          alert("검색어를 입력하세요");
          return;
        }

        window.location.href = `../search/search.html?query=${encodeURIComponent(
          searchQuery
        )}&option=${encodeURIComponent(selectedOption)}`;
      }
    });
});
