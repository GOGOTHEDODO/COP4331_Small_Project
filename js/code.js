import userOps from "./userOperations.js";
import contactOps from "./contactOperations.js";

// TODO : Check login status on dom load

// Landing page functions for login and signup
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", userOps.doLogin);
  }

  const signUpButton = document.getElementById("signUpButton");
  if (signUpButton) {
    signUpButton.addEventListener("click", userOps.doSignup);
  }

  // Contact page functions
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", contactOps.retrieveContacts);
  }

  const addContactForm = document.getElementById("addContactForm");
  if (addContactForm) {
    addContactForm.addEventListener("submit", contactOps.addContact);
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", userOps.doLogout);
  }

  const buttons = document.querySelectorAll(".table-container .btn");
  if (buttons.length > 0) {
    buttons.forEach((button) => {
      if (button.querySelector(".fa-pen-to-square")) {
        button.addEventListener("click", () => contactOps.editContact(button));
      } else if (button.querySelector(".fa-trash")) {
        button.addEventListener("click", () =>
          contactOps.deleteContact(button)
        );
      }
    });
  }
});
