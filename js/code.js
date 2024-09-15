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
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", userOps.doLogout);
  }

  // Contact page functions
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    contactOps.retrieveContacts();
    searchInput.addEventListener("keyup", function () {
      contactOps.retrieveContacts(searchInput.value);
    });
  }
  const addContactForm = document.getElementById("addContactForm");
  if (addContactForm) {
    addContactForm.addEventListener("submit", contactOps.addContact);
  }
});

export default { addContact, retrieveContacts } = contactOps;
