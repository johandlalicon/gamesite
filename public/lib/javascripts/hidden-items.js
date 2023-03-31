const hiddenList = [...document.querySelectorAll(".overflow-platforms")];
const btnShow = [...document.querySelectorAll("#btn-show")];

for (let i = 0; i < btnShow.length; i++) {
  btnShow[i].addEventListener("click", () => {
    hiddenList[i].classList.toggle("hidden");
    console.log("Clicked");
  });
}
