const gameContainers = [...document.querySelectorAll(".carousel-container")];
const nxtBtn = [...document.querySelectorAll(".nxt-btn")];
const prvBtn = [...document.querySelectorAll(".pre-btn")];

gameContainers.forEach((item, i) => {
  let containerDimensions = item.getBoundingClientRect();
  let containerWidth = containerDimensions.width;

  nxtBtn[i].addEventListener("click", () => {
    item.scrollLeft += containerWidth;
  });

  prvBtn[i].addEventListener("click", () => {
    item.scrollLeft -= containerWidth;
  });
});
