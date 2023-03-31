const likeDislikeForm = document.querySelectorAll("#like-dislike-form");
const likeBtn = document.querySelectorAll(".like-btn");
const dislikeBtn = document.querySelectorAll(".dislike-btn");
const likedSvg = document.querySelectorAll(".liked");
const dislikedSvg = document.querySelectorAll(".disliked");
const likeCount = document.querySelectorAll(".like-count");
const dislikeCount = document.querySelectorAll(".dislike-count");
const noUserForm = document.querySelectorAll("#like-dislike-form-nouser");

likeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");
  });
});

dislikeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("disliked");
  });
});

likeDislikeForm.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const reviewId = form.getAttribute("data-value-reviewId");
    const action = event.submitter.value;
    console.log(action);
    console.log(reviewId);
    axios
      .post(`/add-${action}/${reviewId}`)
      .then((response) => {
        const clickedBtn = event.submitter;
        if (response.data.message === "liked") {
          console.log("LIKED!");
          clickedBtn.classList.add("liked");
          const likeCount = clickedBtn.nextElementSibling;
          likeCount.textContent = response.data.totalLikes;
          const dislikeBtn = likeCount.nextElementSibling;
          dislikeBtn.nextElementSibling.classList.remove("disliked");
          dislikeBtn.nextElementSibling.textContent =
            response.data.totalDislikes;
        } else if (response.data.message === "disliked") {
          console.log("DISLIKED!");
          clickedBtn.classList.add("disliked");
          const likeCount = clickedBtn.previousElementSibling;
          likeCount.textContent = response.data.totalLikes;
          clickedBtn.nextElementSibling.textContent =
            response.data.totalDislikes;
          likeCount.previousElementSibling.classList.remove("liked");

          console.log(response.data.totalDislikes);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          // handle unauthorized error, for example:
          window.location.href = "/user";
        } else {
          console.log(err);
        }
      });
  });
});
