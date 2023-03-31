const loginForm = document.querySelector(".login-container");
const signUpForm = document.querySelector(".signup-container");
const signUpBtn = document.querySelector(".show-signup-form");
const loginBtn = document.querySelector(".show-login-form");
const loginHeader = document.querySelector(".login-title");

signUpBtn.addEventListener("click", () => {
  loginForm.classList.toggle("hidden");
  signUpForm.classList.toggle("hidden");
  loginHeader.textContent = "Sign Up Here";
});

loginBtn.addEventListener("click", () => {
  loginForm.classList.toggle("hidden");
  signUpForm.classList.toggle("hidden");
  loginHeader.textContent = "Login here";
});
