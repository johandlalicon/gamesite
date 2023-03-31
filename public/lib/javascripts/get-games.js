const allBtns = document.querySelectorAll(".game-category-btn");
const listContainer = document.querySelector(".game-list-container");

allBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    allBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    const action = event.target.value;
    axios
      .get(`/user/games/${action}`)
      .then((response) => {
        const gameList = response.data.gameList;

        listContainer.innerHTML = "";

        if (gameList.length === 0) {
          const text = document.createElement("h2");
          listContainer.appendChild(text);
          text.textContent = "No games found!";
        } else {
          gameList.forEach((data) => {
            const game = document.createElement("div");
            const img = document.createElement("img");
            const link = document.createElement("a");
            listContainer.appendChild(game);
            game.classList.add("user-games-card");
            game.appendChild(link);
            link.appendChild(img);
            link.href = `/game/${data.gameId}`;
            img.setAttribute("src", data.cover);
          });
        }
        btn.classList.add("active");
      })
      .catch((err) => console.log(err));
  });
});
