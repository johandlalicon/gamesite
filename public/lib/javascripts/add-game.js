const form = document.querySelectorAll("#favorite-game-form");

form.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const gameId = form.getAttribute("data-gameId-value");
    const name = form.getAttribute("data-gameName-value");
    const cover = form.getAttribute("data-gameCover-value");
    const action = event.submitter.value;
    axios
      .post(`/add-games/${action}`, { data: { gameId, name, cover } })
      .then((response) => {
        const clickedBtn = event.submitter;
        const svg = clickedBtn.querySelector("svg");
        svg.classList.toggle("added");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
