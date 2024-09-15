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

  // Get the table body
  const table = document.querySelector(".table tbody");

  // Get the current number of rows to calculate the new contact's number
  const rowCount = table.rows.length + 1;

  // Create a new row and insert it into the table
  const newRow = table.insertRow();

  // Insert cells into the row, including a hidden ID in a data attribute
  newRow.innerHTML = `
    <th scope="row">${rowCount}</th>
    <td>${firstName}</td>
    <td>${lastName}</td>
    <td>${email}</td>
    <td>${phoneNumber}</td>
    <td class="button-table" data-contact-id="temp-id">
      <button class="btn edit-btn">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="btn delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  // Clear the form fields after adding the contact
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
        // Update the row with the actual contact ID from the response
        newRow
          .querySelector(".button-table")
          .setAttribute("data-contact-id", response.contact_id);
        console.log("Contact added to backend successfully");

        // Attach event listeners for the new row
        attachEventListeners(newRow);
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error adding contact to backend:", err);
  }
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
  const saveButtonHTML = `<button class="btn save-btn"><i class="fa-solid fa-save"></i></button>`;

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

function editContact(row) {
  // Get current values from the row
  const firstName = row.cells[1].innerText;
  const lastName = row.cells[2].innerText;
  const email = row.cells[3].innerText;
  const phoneNumber = row.cells[4].innerText;

  // Convert cells to input fields for editing
  row.cells[1].innerHTML = `<input type="text" value="${firstName}">`;
  row.cells[2].innerHTML = `<input type="text" value="${lastName}">`;
  row.cells[3].innerHTML = `<input type="email" value="${email}">`;
  row.cells[4].innerHTML = `<input type="text" value="${phoneNumber}">`;

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
          console.log("Contact deleted successfully");
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  }
}

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
}

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
      <td>${contact.phone_number}</td>
      <td class="button-table" data-contact-id="${contact.contact_id}">
        <button class="btn edit-btn">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn delete-btn">
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

const contactOps = {
  addContact,
  retrieveContacts,
};
export default contactOps;
