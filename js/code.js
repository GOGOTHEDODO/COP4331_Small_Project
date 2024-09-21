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
    userOps.readCookie();
    contactOps.retrieveContacts();
    searchInput.addEventListener("keyup", function () {
      contactOps.retrieveContacts(searchInput.value);
    });
  }

  const sortButtons = document.querySelectorAll('.toggle-sort-first, .toggle-sort-last, .toggle-sort-email, .toggle-sort-phone');

  sortButtons.forEach(button => {
      button.addEventListener('click', contactOps.sort);
  });

  const addContactForm = document.getElementById("addContactForm");
  const notificationBox = document.getElementById("notificationBox");

  if (addContactForm) {
    addContactForm.addEventListener("submit", (event) => {
      // event.preventDefault();
      contactOps.addContact();
      showNotification();
    });
  }

  function showNotification() {
    notificationBox.style.display = "block";
    setTimeout(() => {
      notificationBox.style.display = "none";
    }, 3000); // Hide after 3 seconds
  }
});
