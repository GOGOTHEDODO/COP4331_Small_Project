import userOps from "./userOperations.js";

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

  // Insert cells into the row
  newRow.innerHTML = `
        <th scope="row">${rowCount}</th>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td class="button-table">
          <button class="btn" onclick="editContact(this)">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn" onclick="deleteContact(this)">
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
        console.log("Contact added to backend successfully");
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error adding contact to backend:", err);
  }
}
function deleteContact(button) {
  const row = button.closest("tr");
  const contactId = row.cells[0].innerText; // Assuming contact ID is in the first cell

  const confirmDelete = confirm(
    "Are you sure you want to delete this contact?"
  );
  if (confirmDelete) {
    // Remove the row from the table
    row.remove();

    // Reindex the rows after deletion
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

function editContact(button) {
  const row = button.closest("tr");
  const contactId = row.cells[0].innerText; // Assuming the contact ID is in the first cell

  // Get current values from the row
  const firstName = row.cells[1].innerText;
  const lastName = row.cells[2].innerText;
  const email = row.cells[3].innerText;

  // Convert cells to input fields for editing
  row.cells[1].innerHTML = `<input type="text" value="${firstName}">`;
  row.cells[2].innerHTML = `<input type="text" value="${lastName}">`;
  row.cells[3].innerHTML = `<input type="email" value="${email}">`;

  // Change edit button to save button
  button.innerHTML = `<i class="fa-solid fa-save"></i>`;
  button.setAttribute("onclick", "saveContact(this, " + contactId + ")");
}

function saveContact(button, contactId) {
  const row = button.closest("tr");
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
  button.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  button.setAttribute("onclick", "editContact(this)");

  // Make an AJAX call to update the contact on the server
  let tmp = {
    contact_id: contactId,
    first_name: updatedFirstName,
    last_name: updatedLastName,
    email: updatedEmail,
    phone_number: updatedPhoneNumber,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/editContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact updated successfully");
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.error("Error updating contact:", err);
  }
}
function retrieveContacts(searchTerm = "") {
  const userId = userOps.getUserId();

  let tmp = {
    user_id: userId,
    search_term: searchTerm,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/retrieveContacts." + extension; // Adjust URL endpoint as needed

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        // Success: Parse the response and update the table
        let jsonObject = JSON.parse(this.responseText);
        if (Array.isArray(jsonObject)) {
          updateContactTable(jsonObject);
        } else {
          console.error("Unexpected response format:", jsonObject);
        }
      } else {
        // Error: Handle error response
        console.error("Error retrieving contacts:", this.responseText);
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

  contacts.forEach((contact, index) => {
    const row = table.insertRow();
    row.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${contact.first_name}</td>
        <td>${contact.last_name}</td>
        <td>${contact.email}</td>
        <td class="button-table">
          <button class="btn" onclick="editContact(this)">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn" onclick="deleteContact(this)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
  });
}

function searchTable() {
  // Get the search input element and its value
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();

  // Get the table and its rows
  const table = document.querySelector(".table tbody");
  const rows = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (let i = 0; i < rows.length; i++) {
    let firstName = rows[i]
      .getElementsByTagName("td")[0]
      .textContent.toLowerCase();
    let lastName = rows[i]
      .getElementsByTagName("td")[1]
      .textContent.toLowerCase();

    if (firstName.includes(filter) || lastName.includes(filter)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
function reindexTable() {
  const table = document.querySelector(".table tbody");
  const rows = table.getElementsByTagName("tr");

  // Reindex the rows so that the first column (#) is updated correctly
  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[0].innerText = i + 1; // Update the number to the new index
  }
}

const contactOps = {
  addContact,
  deleteContact,
  editContact,
  saveContact,
  retrieveContacts,
};

export default contactOps;
