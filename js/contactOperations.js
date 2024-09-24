import userOps from "./userOperations.js";
const urlBase = "http://www.smallproject14.pro/API";
const extension = "php";

function addContact(event) {
  event.preventDefault(); // Prevent form from submitting and refreshing the page

  // Get the input values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const userId = userOps.getUserId();

  if (
    !validateUserInput("addContact", firstName, lastName, email, phoneNumber)
  ) {
    return;
  }

  document.getElementById("addContactForm").reset();

  // Backend section
  const tmp = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone_number: phoneNumber,
    user_id: userId,
  };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/addContact.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        retrieveContacts();
        console.log("Contact added to backend successfully");
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error adding contact to backend:", err);
  }
}

function editContact(row) {
  // Get current values from the row
  const firstName = row.cells[1].innerText;
  const lastName = row.cells[2].innerText;
  const email = row.cells[3].innerText;
  const phoneNumber = row.cells[4].innerText;

  // Convert cells to input fields for editing
  row.cells[1].innerHTML = `<input type="text" class="first-name-input" value="${firstName}">`;
  row.cells[2].innerHTML = `<input type="text" class="last-name-input" value="${lastName}">`;
  row.cells[3].innerHTML = `<input type="email" class="email-input" value="${email}">`;
  row.cells[4].innerHTML = `<input type="text" class="phone-input" value="${phoneNumber}">`;

  // Replace the edit button with a save button
  replaceButton(row, true);
}

function saveContact(row) {
  const contactId = row
    .querySelector(".button-table")
    .getAttribute("data-contact-id");

  const updatedFirstName = row.cells[1].querySelector("input").value;
  const updatedLastName = row.cells[2].querySelector("input").value;
  const updatedEmail = row.cells[3].querySelector("input").value;
  const updatedPhoneNumber = row.cells[4].querySelector("input").value;
  const userId = userOps.getUserId(); // Ensure user_id is included

  // Check if edited field meets requirements
  if (
    !validateUserInputEdit(row, updatedFirstName, updatedLastName, updatedEmail, updatedPhoneNumber)
  ) {
    const divider = row.querySelector(".divider"); 
    if (divider) {
      divider.classList.remove("valid");
    }
    return;
  }

  // Update the row with new values
  row.cells[1].innerText = updatedFirstName;
  row.cells[2].innerText = updatedLastName;
  row.cells[3].innerText = updatedEmail;
  row.cells[4].innerText = updatedPhoneNumber;

  // Replace the save button with an edit button
  replaceButton(row, false);

  // Make an AJAX call to update the contact on the server
  const tmp = {
    contact_id: contactId,
    first_name: updatedFirstName,
    last_name: updatedLastName,
    email: updatedEmail,
    phone_number: updatedPhoneNumber,
    user_id: userId, // Add user_id here
  };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/editContact.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showNotificationMessage("Contact Updated!")
      console.log("Contact updated successfully");
    }
  };
  try {
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error updating contact:", err);
  }
}

function deleteContact(row) {
  const contactId = row
    .querySelector(".button-table")
    .getAttribute("data-contact-id");

  const confirmDelete = confirm(
    "Are you sure you want to delete this contact?"
  );
  if (confirmDelete) {
    row.remove();
    reindexTable();

    // Backend part
    const userId = userOps.getUserId();
    const tmp = { contact_id: contactId, user_id: userId };
    const jsonPayload = JSON.stringify(tmp);
    const url = `${urlBase}/deleteContact.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          showNotificationMessage("Contact Deleted!")
          console.log("Contact deleted successfully");
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  }
}

// test for notification box
function showNotificationMessage(message) {
  var notification = document.getElementById('notificationBox');
  notification.textContent = message;
  notification.style.display = 'block'; 
  notification.style.opacity = '1'; 

  setTimeout(function() {
      notification.style.opacity = '0'; 
     scrollX
      setTimeout(function() {
          notification.style.display = 'none';
      }, 500); 
  }, 5000);
}

/*function retrieveContacts(searchTerm = "") {
  const userId = userOps.getUserId();

  const tmp = {
    user_id: userId,
    search_term: searchTerm,
  };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/retrieveContacts.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const jsonObject = JSON.parse(this.responseText);
        if (Array.isArray(jsonObject.data)) {
          updateContactTable(jsonObject.data);
        } else {
          console.error("Unexpected response format:", jsonObject);
          updateContactTable([]);
        }
      } else {
        console.error("Error retrieving contacts:", this.responseText);
        updateContactTable([]);
      }
    }
  };

  try {
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error sending request:", err);
  }
}*/

function retrieveContacts(searchTerm = "") {
  const userId = userOps.getUserId();

  const tmp = {
    user_id: userId,
    search_term: searchTerm,
  };
  const jsonPayload = JSON.stringify(tmp);
  const url = `${urlBase}/retrieveContacts.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const jsonObject = JSON.parse(this.responseText);
        if (Array.isArray(jsonObject.data)) {
          const sortedContacts = sortContacts(jsonObject.data, 'first_name'); // Default sort by first name
          updateContactTable(sortedContacts);
        } else {
          console.error("Unexpected response format:", jsonObject);
          updateContactTable([]);
        }
      } else {
        console.error("Error retrieving contacts:", this.responseText);
        updateContactTable([]);
      }
    }
  };

  try {
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error sending request:", err);
  }
}

// helper functions
function updateContactTable(contacts) {
  const table = document.querySelector(".table tbody");
  table.innerHTML = "";
  if (contacts.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6; // Adjust this value based on the number of columns in your table
    cell.textContent = "No contacts found";
    cell.style.textAlign = "center";
    return;
  }
  contacts.forEach((contact, index) => {
    const row = table.insertRow();
    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${contact.first_name}</td>
      <td>${contact.last_name}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
      <td class="button-table" data-contact-id="${contact.contact_id}">
        <button class="btn edit-btn">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn delete-btn" id="delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    attachEventListeners(row);
  });
}

function reindexTable() {
  const table = document.querySelector(".table tbody");
  Array.from(table.rows).forEach((row, index) => {
    row.cells[0].innerText = index + 1;
  });
}

function validateUserInput(formId, firstName, lastName, email, phoneNumber) {
  const namePattern = /^[A-Za-z]+$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^[0-9]{10,12}$/;
  const errorContainer = document.getElementById(formId + "-errorMessages");

  // Clear previous errors
  errorContainer.innerHTML = "";

  const validationResults = {
    firstName: { valid: true, message: "" },
    lastName: { valid: true, message: "" },
    email: { valid: true, message: "" },
    phoneNumber: { valid: true, message: "" },
  };

  if (!namePattern.test(firstName)) {
    validationResults.firstName = {
      valid: false,
      message: "First name should contain only alphabetic characters.",
    };
  }
  if (!namePattern.test(lastName)) {
    validationResults.lastName = {
      valid: false,
      message: "Last name should contain only alphabetic characters.",
    };
  }
  if (!emailPattern.test(email)) {
    validationResults.email = {
      valid: false,
      message: "Please enter a valid email address.",
    };
  }
  if (!phonePattern.test(phoneNumber)) {
    validationResults.phoneNumber = {
      valid: false,
      message: "Please enter a valid phone number (10-12 digits).",
    };
  }

  Object.keys(validationResults).forEach((key) => {
    const result = validationResults[key];
    const input = document.getElementById(key);
    const divider = input.parentElement;
    const checkIcon = divider.querySelector(".fa-check");
    const xmarkIcon = divider.querySelector(".fa-xmark");

    if (input) {
      if (!result.valid) {
       divider.classList.remove("valid");

        const errorMsg = document.createElement("div");
        errorMsg.className = "error-msg";
        errorMsg.innerHTML = `
          <span class="fa fa-exclamation-triangle"></span> ${result.message}
        `;
        errorContainer.appendChild(errorMsg);
      } 
      else {
        divider.classList.remove("valid");
      }
    }
  });

  return Object.values(validationResults).every((result) => result.valid);
}

function attachEventListeners(row) {
  // Attach edit and delete button event listeners
  row
    .querySelector(".edit-btn")
    .addEventListener("click", () => editContact(row));
  row
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteContact(row));
}

function replaceButton(row, isEditMode) {
  const buttonTable = row.querySelector(".button-table");
  const editButtonHTML = `<button class="btn edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>`;
  const saveButtonHTML = `<button class="btn save-btn" id="save"><i class="fa-solid fa-save"></i></button>`;

  // Keep the delete button and only replace the edit button
  const deleteButtonHTML = buttonTable.querySelector(".delete-btn").outerHTML;
  const buttonHTML = isEditMode ? saveButtonHTML : editButtonHTML;

  buttonTable.innerHTML = buttonHTML + deleteButtonHTML;

  const newButton = buttonTable.querySelector("button");
  if (isEditMode) {
    newButton.addEventListener("click", () => saveContact(row));
  } else {
    newButton.addEventListener("click", () => editContact(row));
  }
}

// testing 
/*function sort(e) {
  const currentButton = e.currentTarget;
  const currentIcon = currentButton.querySelector('i');

  window.contactOps.sortButtons.forEach(button => { // gets sortButtons from code.js
    if (button != currentButton) { // checks for all buttons except for the one pressed 
      const icon = button.querySelector('i');
      icon.classList.remove('fa-sort-up', 'fa-sort-down'); // resets all other buttons to 
      icon.classList.add('fa-sort');                       // defualt sort for user simplicity
    }
  });

  if (currentIcon.classList.contains('fa-sort')) {            // defualt sort to ascending sort
      currentIcon.classList.remove('fa-sort'); 
      currentIcon.classList.add('fa-sort-up');
  } else if (currentIcon.classList.contains('fa-sort-up')) {  // ascending sort to descending
      currentIcon.classList.remove('fa-sort-up');
      currentIcon.classList.add('fa-sort-down');
  } else {                                                    // descending sort to defualt sort
      currentIcon.classList.remove('fa-sort-down');
      currentIcon.classList.add('fa-sort');
  }
} */

function validateUserInputEdit(row, firstName, lastName, email, phoneNumber) {
  const namePattern = /^[A-Za-z]+$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^[0-9]{10,12}$/;
  const validationResults = {
    firstName: { valid: true, message: "" },
    lastName: { valid: true, message: "" },
    email: { valid: true, message: "" },
    phoneNumber: { valid: true, message: "" },
  };

  if (!namePattern.test(firstName)) {
    validationResults.firstName = {
      valid: false,
      message: "First name should contain only alphabetic characters.",
    };
  }
  if (!namePattern.test(lastName)) {
    validationResults.lastName = {
      valid: false,
      message: "Last name should contain only alphabetic characters.",
    };
  }
  if (!emailPattern.test(email)) {
    validationResults.email = {
      valid: false,
      message: "Please enter a valid email address.",
    };
  }
  if (!phonePattern.test(phoneNumber)) {
    validationResults.phoneNumber = {
      valid: false,
      message: "Please enter a valid phone number (10-12 digits).",
    };
  }
  if (row.nextElementSibling && row.nextElementSibling.classList.contains('error-row')) {
    row.nextElementSibling.remove(); // remove error rows
  }

  let hasErrors = false;

  const inputFields = {
    firstNameInput: row.querySelector('.first-name-input'),
    lastNameInput: row.querySelector('.last-name-input'),
    emailInput: row.querySelector('.email-input'),
    phoneInput: row.querySelector('.phone-input'),
  };

  Object.keys(validationResults).forEach((key) => {
    const result = validationResults[key];
    const inputField = inputFields[`${key}Input`];
    if (inputField) {
      if (!result.valid) {
        hasErrors = true;
        inputField.classList.add('error-border'); 
      } else {
        inputField.classList.remove('error-border');
      }
    } else {
      console.error(`Input field for ${key} is undefined.`);
    }
  });

  if (hasErrors) {
    const errorRow = document.createElement('tr');
    errorRow.classList.add('error-row'); // add error row and display error messages
    const errorCell = document.createElement('td');
    errorCell.colSpan = row.children.length; // span across all columns
    errorCell.innerHTML = `
      ${!validationResults.firstName.valid ? '<span class="fa fa-exclamation-triangle icon-space"></span>' + validationResults.firstName.message + '<br>' : ''}
      ${!validationResults.lastName.valid ? '<span class="fa fa-exclamation-triangle icon-space"></span>' + validationResults.lastName.message + '<br>' : ''}
      ${!validationResults.email.valid ? '<span class="fa fa-exclamation-triangle icon-space"></span>' + validationResults.email.message + '<br>' : ''}
      ${!validationResults.phoneNumber.valid ? '<span class="fa fa-exclamation-triangle icon-space"></span>' + validationResults.phoneNumber.message + '<br>' : ''}
    `;
    errorRow.appendChild(errorCell);
    row.parentNode.insertBefore(errorRow, row.nextElementSibling);
  }

  return Object.values(validationResults).every((result) => result.valid);
}

function sort(e) {
  const currentButton = e.currentTarget;
  const currentIcon = currentButton.querySelector('i');
  const category = currentButton.dataset.sortCategory; // Assuming buttons have a data attribute for category

  // Reset other sort buttons
  window.contactOps.sortButtons.forEach(button => {
    if (button !== currentButton) {
      const icon = button.querySelector('i');
      icon.classList.remove('fa-sort-up', 'fa-sort-down');
      icon.classList.add('fa-sort');
    }
  });

  let direction = 'asc'; // Default to ascending

  if (currentIcon.classList.contains('fa-sort')) { // Default sort to ascending sort
    currentIcon.classList.remove('fa-sort');
    currentIcon.classList.add('fa-sort-up');
  } else if (currentIcon.classList.contains('fa-sort-up')) { // Ascending sort to descending
    currentIcon.classList.remove('fa-sort-up');
    currentIcon.classList.add('fa-sort-down');
    direction = 'desc';
  } else { // Descending sort to default sort
    currentIcon.classList.remove('fa-sort-down');
    currentIcon.classList.add('fa-sort');
    return; // Exit function to not perform sorting
  }

  // Sorting logic
  const contacts = window.contactOps.contacts; // Assuming contacts is an array of contact objects
  contacts.sort((a, b) => {
    let comparison = 0;
    
    // Determine the comparison based on the category
    if (category === 'first') {
      comparison = a.firstName.localeCompare(b.firstName);
    } else if (category === 'last') {
      comparison = a.lastName.localeCompare(b.lastName);
    } else if (category === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (category === 'phone') {
      comparison = a.phone.localeCompare(b.phone);
    }

    // Adjust comparison based on direction
    return direction === 'asc' ? comparison : -comparison;
  });

  // Update the display after sorting (assuming you have a function to render contacts)
  renderContacts(contacts); // Replace with your actual render function
}

let sortState = {
  first_name: 'original',
  last_name: 'original',
  email: 'original',
  phone: 'original',
};

// Function to sort contacts by a given field
function sortContacts(contacts, field) {
  if (sortState[field] === 'original') {
    return contacts; // Return in original order
  }
  
  const order = sortState[field] === 'asc' ? 1 : -1;
  return contacts.sort((a, b) => {
    if (a[field] < b[field]) return -1 * order;
    if (a[field] > b[field]) return 1 * order;
    return 0;
  });
}

// Function to toggle sort order and update the table
function toggleSort(field) {
  if (sortState[field] === 'original') {
    sortState[field] = 'asc';
  } else if (sortState[field] === 'asc') {
    sortState[field] = 'desc';
  } else {
    sortState[field] = 'original';
  }
  
  retrieveContacts(); // Re-fetch contacts to apply sorting
}

const contactOps = {
  addContact,
  retrieveContacts,
  sort,
};
export default contactOps;
