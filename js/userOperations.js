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
        console.log(err.message);
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
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName};lastName=${lastName};username=${username};userId=${userId};expires=${date.toUTCString()};path=/`;
}

function readCookie() {
  userId = -1;
  console.log("COOKIE: " + document.cookie);
  const cookies = document.cookie.split(";");
  console.log(cookies);
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    switch (name) {
      case "firstName":
        firstName = value;
        break;
      case "lastName":
        lastName = value;
        break;
      case "username":
        username = value;
        break;
      case "userId":
        userId = parseInt(value.trim(), 10);
        break;
    }
  });

  console.log("Cookies:", document.cookie); // Debugging line to see all cookies
  console.log("User ID:", userId); // Debugging line to check userId

  if (userId < 0) {
    console.log("User ID is invalid, redirecting to index.html");
    //   window.location.href = "index.html";
  } else {
    console.log("Logged in as", firstName, lastName);
    // document.getElementById("userName").innerHTML = `Logged in as ${firstName} ${lastName}`;
  }
}

function clearCookie() {
  userId = 0;
  firstName = "";
  lastName = "";
  username = "";
  document.cookie = "firstName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
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
