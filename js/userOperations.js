// TODO : Hash user passwords and retrieve them unhashed
const urlBase = "http://www.smallproject14.pro/API";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let username = "";

function getUserId() {
  return userId;
}

function doLogin() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  const usernameStyle = document.getElementById("loginUsername");
  const passwordStyle = document.getElementById("loginPassword");

  document.getElementById("loginResult").innerHTML = "";

  if (!username || !password) {
    usernameStyle.style.borderBottom = "5px solid lightcoral";
    passwordStyle.style.borderBottom = "5px solid lightcoral";

    showNotificationMessage("Username and password are required.");
    return;
  }
  else {
    usernameStyle.style.border = "transparent";
    passwordStyle.style.border = "transparent";
  }

  let tmp = { username: username, password: password };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      let jsonObject;
      try {

        jsonObject = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          if (jsonObject.success) {
            let userData = jsonObject.data;
            userId = userData.user_id;
            firstName = userData.first_name;
            lastName = userData.last_name;

            saveCookie();

            window.location.href = "contacts.html";
          } else {
            // Handle server-side error
            document.getElementById("loginResult").innerHTML =
              jsonObject.message;
          }
        } else {
          // Handle HTTP error
          showNotificationMessage( "An error occurred: " + jsonObject.message);
          document.getElementById("loginResult").innerHTML =
            "An error occurred: " + jsonObject.message;
        }
      } catch (err) {
        document.getElementById("loginResult").innerHTML =
          "Failed to parse response: " + err.message;
      }
    }
  };

  xhr.send(jsonPayload);
}

// TODO : After signup log user in
function doSignup() {
  function getInputValueAndStyle(id) {
    const element = document.getElementById(id);
    return {
        value: element.value,
        style: element
    };
  }

  // gets the values and styles for input
  const firstName = getInputValueAndStyle("signupFirstName");
  const lastName = getInputValueAndStyle("signupLastName");
  const username = getInputValueAndStyle("signupUsername");
  const password = getInputValueAndStyle("signupPassword");
  const passwordConfirm = getInputValueAndStyle("signupPasswordConfirm");

  document.getElementById("signupResult").innerHTML = "";

  // for changing the border color
  function setBorderStyle(element, isError) {
    element.style.borderBottom = isError ? "5px solid lightcoral" : "transparent";
  }

  // Check if passwords match
  if (password.value !== passwordConfirm.value) {
    setBorderStyle(password.style, true);
    setBorderStyle(passwordConfirm.style, true);
    showNotificationMessage("Passwords don't match.");
    return;
  }
  else {
    setBorderStyle(password.style, false);
    setBorderStyle(passwordConfirm.style, false);
  }
  
  // Check if all fields are filled
  const fields = [username, password, firstName, lastName];
  const fieldIds = ["signupUsername", "signupPassword", "signupFirstName", "signupLastName"]; 

  for (let i = 0; i < fields.length; i++) {
    // if the input is not filled
    if (!fields[i].value) {
      setBorderStyle(fields[i].style, true);
    } else {
      setBorderStyle(fields[i].style, false);
    }
  }

  // displays error message 
  if (fields.some(field => !field.value)) {
    showNotificationMessage("Please fill out all fields.");
    return;
  }

  let payload = {
    first_name: firstName.value,
    last_name: lastName.value,
    username: username.value,
    password: password.value,
  };

  let jsonPayload = JSON.stringify(payload);

  let url = urlBase + "/signup." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      try {
        let response = JSON.parse(xhr.responseText);

        if (xhr.status === 200 && response.success) {
          // Handle success
          document.getElementById("signupResult").innerHTML =
            "Account created successfully. Please log in.";
        } else {
          // Handle server-side error
          document.getElementById("signupResult").innerHTML =
            "Error: " + (response.message || "An error occurred.");
        }
      } catch (err) {
        document.getElementById("signupResult").innerHTML =
          "Failed to parse response: " + err.message;
        console.log(err.message);
      }
    }
  };

  xhr.send(jsonPayload);
}

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

function doLogout() {
  clearCookie();
}

function saveCookie() {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${encodeURIComponent(
    firstName
  )}; expires=${date.toUTCString()}; path=/`;

  document.cookie = `lastName=${encodeURIComponent(
    lastName
  )}; expires=${date.toUTCString()}; path=/`;

  document.cookie = `userId=${encodeURIComponent(
    userId
  )}; expires=${date.toUTCString()}; path=/`;
}

function readCookie() {
  userId = -1;
  firstName = "";
  lastName = "";
  username = "";
  const cookies = document.cookie.split(";");

  console.log("Cookies during read:", document.cookie);

  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    switch (name) {
      case "firstName":
        firstName = decodeURIComponent(value);
        break;
      case "lastName":
        lastName = decodeURIComponent(value);
        break;
      case "userId":
        userId = parseInt(value.trim(), 10);
        break;
    }
  });

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML = `Welcome ${firstName} ${lastName}`;
  }
}

function clearCookie() {
  userId = 0;
  firstName = "";
  lastName = "";
  username = "";
  document.cookie = "firstName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  document.cookie = "lastName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  document.cookie = "userId=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  window.location.href = "index.html";
}

const userOps = {
  getUserId,
  doLogin,
  doSignup,
  doLogout,
  readCookie,
};
export default userOps;
