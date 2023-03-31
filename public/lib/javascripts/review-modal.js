const modal = document.querySelector("#modal-review");
const openModal = document.querySelector(".open-modal-btn");
const closeModal = document.querySelectorAll(".close-modal-btn");

const editModalForm = document.querySelector("#modal-edit-review");
const editReviewBtn = document.querySelectorAll("#edit-review-btn");
const existingReviewForm = document.querySelector(".existing-review-form");

const editTextArea = document.querySelector("#edit-textarea");
const editRating = document.querySelector("#edit-rating");
const editGameId = document.querySelector("#edit-gameId");
const editReviewId = document.querySelector("#edit-reviewId");

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.close();
    editModalForm.close();
  });
});

editReviewBtn.forEach((btn, i) => {
  if (!btn.classList.contains("hide")) {
    const reviewId = btn.getAttribute("data-review-id");
    btn.addEventListener("click", () => {
      editModalForm.showModal();
      axios
        .get(`/edit-review/${reviewId}`)
        .then(function (response) {
          const review = response.data;
          console.log(review.review_text);
          editReviewId.value = review._id;
          editTextArea.value = review.review_text;
          editRating.value = review.rating;
          editGameId.value = review.game_id;
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  }
});

function confirmDelete() {
  if (confirm("Are you sure you want to delete?")) {
    document.getElementById("delete-review-form").submit();
  }
}
