import userOps from "./userOperations.js";
import contactOps from "./contactOperations.js";

// const urlBase = "http://www.smallproject14.pro";
// const extension = "php";

// Landing page functions for login and logout
// TODO : Check login status on dom load
document.getElementById("loginButton").addEventListener("click", () => {
  userOps.doLogin();
});

document.getElementById("signUpButton").addEventListener("click", () => {
  userOps.doSignup();
});

// Contact page functions
