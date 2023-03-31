const slides = document.querySelectorAll(".topgame-card");
const prevBtnTop = document.querySelector(".prev-top-btn");
const nextBtnTop = document.querySelector(".next-top-btn");

let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

function prevSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

nextBtnTop.addEventListener("click", () => {
  nextSlide();
});

prevBtnTop.addEventListener("click", () => {
  prevSlide();
  console.log("Prev!");
});
