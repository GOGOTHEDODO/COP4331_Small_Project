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

  document.getElementById("loginResult").innerHTML = "";

  if (!username || !password) {
    document.getElementById("loginResult").innerHTML =
      "Username and password are required.";
    return;
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
            userId = jsonObject.message.user_id;
            firstName = jsonObject.message.first_name;
            lastName = jsonObject.message.last_name;

            saveCookie();
            window.location.href = "contacts.html";
          } else {
            // Handle server-side error
            document.getElementById("loginResult").innerHTML =
              jsonObject.message;
          }
        } else {
          // Handle HTTP error
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
// TODO : color entries if invalid input
function doSignup() {
  let firstName = document.getElementById("signupFirstName").value;
  let lastName = document.getElementById("signupLastName").value;
  let username = document.getElementById("signupUsername").value;
  let password = document.getElementById("signupPassword").value;
  let passwordConfirm = document.getElementById("signupPasswordConfirm").value;

  document.getElementById("signupResult").innerHTML = "";

  // Check if passwords match
  if (password !== passwordConfirm) {
    document.getElementById("signupResult").innerHTML =
      "Passwords don't match.";
    return;
  }

  // Check if all fields are filled
  if (!username || !password || !firstName || !lastName) {
    document.getElementById("signupResult").innerHTML =
      "Please fill out all fields.";
    return;
  }

  let payload = {
    first_name: firstName,
    last_name: lastName,
    username: username,
    password: password,
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
      }
    }
  };

  xhr.send(jsonPayload);
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
    ",username=" +
    username +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (let i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "username") {
      username = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
    // TODO : Logged in statement inside contacts.html
  } else {
    // document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
  }
}

function clearCookie() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
