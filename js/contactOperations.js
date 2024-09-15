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
      <button class="btn">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  // Clear the form fields after adding the contact
  document.getElementById("addContactForm").reset();

  // Backend section
  let tmp = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone_number: phoneNumber,
    user_id: userId,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/addContact." + extension;

  let xhr = new XMLHttpRequest();
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
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error adding contact to backend:", err);
  }
}
function editContact(row) {
  const contactId = row
    .querySelector(".button-table")
    .getAttribute("data-contact-id");

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

  // Change the edit button to a save button
  // Change the edit button to a save button
  const buttonTable = row.querySelector(".button-table");
  const editBtn = buttonTable.querySelector(".fa-pen-to-square");
  console.log(editBtn.classList);
  editBtn.classList.add("fa-save");
  editBtn.classList.remove("fa-pen-to-square");

  console.log("After change:", editBtn.classList);
  // Log the updated class list
}
function saveContact(row, contactId) {
  const updatedFirstName = row.cells[1].querySelector("input").value;
  const updatedLastName = row.cells[2].querySelector("input").value;
  const updatedEmail = row.cells[3].querySelector("input").value;
  const updatedPhoneNumber = row.cells[4].querySelector("input").value;

  // Update the row with new values
  row.cells[1].innerText = updatedFirstName;
  row.cells[2].innerText = updatedLastName;
  row.cells[3].innerText = updatedEmail;
  row.cells[4].innerText = updatedPhoneNumber;

  // Revert save button back to edit button
  const saveBtn = row.querySelector(".fa-save");
  if (saveBtn) {
    saveBtn.classList.remove("fa-save");
    saveBtn.classList.add("fa-pen-to-square");

    // Ensure button click listener is correctly managed
    const button = saveBtn.closest("button");
    button.removeEventListener("click", () => editContact(row));
    button.addEventListener("click", () => editContact(row));
  } else {
    console.error("Save button not found.");
  }

  // Make an AJAX call to update the contact on the server
  const tmp = {
    contact_id: contactId,
    first_name: updatedFirstName,
    last_name: updatedLastName,
    email: updatedEmail,
    phone_number: updatedPhoneNumber,
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
    let tmp = { contact_id: contactId, user_id: userId };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/deleteContact." + extension;

    let xhr = new XMLHttpRequest();
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

  let tmp = {
    user_id: userId,
    search_term: searchTerm,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/retrieveContacts." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        let jsonObject = JSON.parse(this.responseText);
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
    cell.colSpan = 5; // Adjust this value based on the number of columns in your table
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
        <button class="btn">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    row
      .querySelector(".fa-pen-to-square")
      .closest("button")
      .addEventListener("click", () => editContact(row));
    row
      .querySelector(".fa-trash")
      .closest("button")
      .addEventListener("click", () => deleteContact(row));
  });
}

function reindexTable() {
  const table = document.querySelector(".table tbody");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[0].innerText = i + 1;
  }
}

const contactOps = {
  addContact,
  retrieveContacts,
};
export default contactOps;
