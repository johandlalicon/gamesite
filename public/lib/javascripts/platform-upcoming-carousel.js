const upcomingGameContainers = [
  ...document.querySelectorAll(".upcoming-container"),
];
const nextBtnUpcoming = [...document.querySelectorAll(".next-upcoming-btn")];
const prevBtnUpcoming = [...document.querySelectorAll(".prev-upcoming-btn")];

upcomingGameContainers.forEach((item, i) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width;

  nextBtnUpcoming[i].addEventListener("click", () => {
    item.scrollLeft += containerWidth;
  });

  prevBtnUpcoming[i].addEventListener("click", () => {
    item.scrollLeft -= containerWidth;
  });
});
