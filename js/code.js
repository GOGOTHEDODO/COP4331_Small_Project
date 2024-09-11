const urlBase = "http://www.smallproject14.pro";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;
  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}
// added signup function
function doSignup() {
  let username = document.getElementById("signupUsername").value;
  let password = document.getElementById("signupPassword").value;
  let passwordConfirm = document.getElementById("signupPasswordConfirm").value;
  document.getElementById("signupResult").innerHTML = "";
  if (password !== passwordConfirm) {
    return; // passwords dont match
  }
  let tmp = {
    username: username,
    password: password,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/Signup." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        if (jsonObject.error) {
          document.getElementById("signupResult").innerHTML =
            "Error: " + jsonObject.error;
          return;
        }
        document.getElementById("signupResult").innerHTML =
          "Account created successfully. Please log in.";
        // Optionally redirect to login page or log the user in directly
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("signupResult").innerHTML = err.message;
  }
}
function doLogout() {
  fetch("logout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Logout successful") {
        clearCookie();
        indow.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    //		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
  }
}
function clearCookie() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}
function deleteContact(button) {
  const row = button.closest('tr');
  const contactId = row.cells[0].innerText;  // Assuming contact ID is in the first cell

  const confirmDelete = confirm("Are you sure you want to delete this contact?");
  if (confirmDelete) {
    // Remove the row from the table
    row.remove();

    // Reindex the rows after deletion
    reindexTable();

    // Make an AJAX call to delete the contact on the server (Optional)
    let tmp = { contactId: contactId };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/DeleteContact." + extension;

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

function reindexTable() {
  const table = document.querySelector('.table tbody');
  const rows = table.getElementsByTagName('tr');

  // Reindex the rows so that the first column (#) is updated correctly
  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[0].innerText = i + 1; // Update the number to the new index
  }
}
function editContact(button) {
  const row = button.closest('tr');
  const contactId = row.cells[0].innerText;  // Assuming the contact ID is in the first cell

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
  button.setAttribute('onclick', 'saveContact(this, ' + contactId + ')');
}

function saveContact(button, contactId) {
  const row = button.closest('tr');
  const updatedFirstName = row.cells[1].querySelector('input').value;
  const updatedLastName = row.cells[2].querySelector('input').value;
  const updatedEmail = row.cells[3].querySelector('input').value;

  // Update the row with new values
  row.cells[1].innerText = updatedFirstName;
  row.cells[2].innerText = updatedLastName;
  row.cells[3].innerText = updatedEmail;

  // Revert save button back to edit button
  button.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  button.setAttribute('onclick', 'editContact(this)');

  // Make an AJAX call to update the contact on the server
  let tmp = { contactId: contactId, firstName: updatedFirstName, lastName: updatedLastName, email: updatedEmail };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/EditContact." + extension;

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
function searchTable() {
  // Get the search input element and its value
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  
  // Get the table and its rows
  const table = document.querySelector('.table tbody');
  const rows = table.getElementsByTagName('tr');

  // Loop through all table rows, and hide those who don't match the search query
  for (let i = 0; i < rows.length; i++) {
    let firstName = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
    let lastName = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
    
    if (firstName.includes(filter) || lastName.includes(filter)) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}
function addContact(event) {
  event.preventDefault(); // Prevent form from submitting and refreshing the page

  // Get the input values
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  // Get the table body
  const table = document.querySelector('.table tbody');

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
  document.getElementById('addContactForm').reset();
}

