const tag = document.querySelector(".search-tag-list");
const spanBtn = document.querySelector(".search-tag > button > span");
const searchBtn = document.querySelector(".search-tag > button");
const selectBtns = document.querySelectorAll(".search-tag-list > button");

let isDisplayed = false;

const toggleDisplay = () => {
  isDisplayed = !isDisplayed;
  if (isDisplayed) {
    tag.style.display = "block";
    spanBtn.style.transform = "rotate(180deg)";
  } else {
    tag.style.display = "none";
    spanBtn.style.transform = "rotate(0deg)";
  }
};

searchBtn.addEventListener("click", toggleDisplay);

selectBtns.forEach(function (button) {
  button.addEventListener("click", (e) => {
    searchBtn.firstChild.textContent = e.target.textContent;
    tag.style.display = "none";
    spanBtn.style.transform = "rotate(0deg)";
    isDisplayed = false;
  });
});
