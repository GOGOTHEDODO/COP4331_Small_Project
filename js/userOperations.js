// TODO : Handle other codes other than 200 for all the functions

const urlBase = "http://www.smallproject14.pro";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function getUserId() {
  return userId;
}
function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;
  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  if (!login || !password) {
    document.getElementById("loginResult").innerHTML =
      "Username and password are required.";
    return;
  }

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
// TODO : After signup log user in
// TODO : color entries if invalid input
function doSignup() {
  let username = document.getElementById("signupUsername").value;
  let password = document.getElementById("signupPassword").value;
  let passwordConfirm = document.getElementById("signupPasswordConfirm").value;
  document.getElementById("signupResult").innerHTML = "";
  if (password !== passwordConfirm) {
    document.getElementById("signupResult").innerHTML = "Passwords dont match";
    return;
  } else if (!username || !password) {
    document.getElementById("signupResult").innerHTML =
      "Please fill out both entries";
    return;
  }
  let tmp = {
    username: username,
    password: password,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/signup." + extension;
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
const userOps = {
  getUserId,
  doLogin,
  doSignup,
  doLogout,
  readCookie,
};
export default userOps;
