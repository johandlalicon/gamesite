const gamesBtn = document.querySelector(".game-list-btn");
const reviewsBtn = document.querySelector(".review-list-btn");
const gamesTab = document.querySelector(".games-tab");
const reviewsTab = document.querySelector(".reviews-tab");
const toggleTabs = document.querySelector(".games-reviews-tabs");

console.log("TEST");

gamesBtn.addEventListener("click", (event) => {
  console.log("game tab");
  if (gamesTab.classList.contains("active")) {
    reviewsTab.classList.remove("active");
  } else {
    gamesTab.classList.add("active");
    reviewsTab.classList.remove("active");
  }
});

reviewsBtn.addEventListener("click", (event) => {
  console.log("review tab");
  if (reviewsTab.classList.contains("active")) {
    gamesTab.classList.remove("active");
  } else {
    reviewsTab.classList.add("active");
    gamesTab.classList.remove("active");
  }
});
