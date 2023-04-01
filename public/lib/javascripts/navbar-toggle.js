const dropDownMenu = document.querySelectorAll(".dropdown");
const dropDownContent = document.querySelectorAll(".dropdown-content");

dropDownMenu.forEach((menu) => {
  menu.addEventListener("click", (event) => {
    dropDownContent.forEach((content) => {
      content.classList.remove("drop");
    });
    event.target.nextElementSibling.classList.add("drop");
  });
});

const hamburgerBtn = document.querySelector(".hamburger-btn");
const navbarMenu = document.querySelector(".navbar-menu");

hamburgerBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("active");
});
