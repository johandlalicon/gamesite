const recentGameContainers = [
  ...document.querySelectorAll(".newgames-container"),
];
const nextBtnRecent = [...document.querySelectorAll(".next-recent-btn")];
const prevBtnRecent = [...document.querySelectorAll(".prev-recent-btn")];

recentGameContainers.forEach((item, i) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width;

  nextBtnRecent[i].addEventListener("click", () => {
    item.scrollLeft += containerWidth;
  });

  prevBtnRecent[i].addEventListener("click", () => {
    item.scrollLeft -= containerWidth;
  });
});
