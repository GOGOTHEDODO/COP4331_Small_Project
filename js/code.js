import userOps from "./userOperations.js";
import contactOps from "./contactOperations.js";

// Landing page functions for login and logout
// TODO : Check login status on dom load
document
  .getElementById("loginButton")
  .addEventListener("click", userOps.doLogin);

document
  .getElementById("signUpButton")
  .addEventListener("click", userOps.doSignup);
// Contact page functions
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("searchInput")
    .addEventListener("keyup", contactOps.retrieveContacts);

  document
    .getElementById("addContactForm")
    .addEventListener("submit", contactOps.addContact);

  document
    .getElementById("logoutButton")
    .addEventListener("click", contactOps.doLogout);

  document.querySelectorAll(".table-container .btn").forEach((button) => {
    if (button.querySelector(".fa-pen-to-square")) {
      button.addEventListener("click", () => contactOps.editContact(button));
    } else if (button.querySelector(".fa-trash")) {
      button.addEventListener("click", () => contactOps.deleteContact(button));
    }
  });
});
