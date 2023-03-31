const carousel = document.querySelector(".screenshot-container");
const imgContainer = document.querySelector(".image-carousel");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const images = imgContainer.querySelectorAll("img");

let currentIndex = 0;
let slideInterval;

function startSlide() {
  slideInterval = setInterval(() => {
    moveToNextSlide();
  }, 3000);
}

function moveToNextSlide() {
  if (currentIndex === images.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  moveSlide();
}

function moveToPrevSlide() {
  if (currentIndex === 0) {
    currentIndex = images.length - 1;
  } else {
    currentIndex--;
  }
  moveSlide();
}

function moveSlide() {
  imgContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

startSlide();

prevBtn.addEventListener("click", () => {
  clearInterval(slideInterval);
  moveToPrevSlide();
  startSlide();
});

nextBtn.addEventListener("click", () => {
  clearInterval(slideInterval);
  moveToNextSlide();
  startSlide();
});
