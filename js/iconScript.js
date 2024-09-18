// each divider needs to have a different id name for it to work :(
const fdivider = document.getElementById('fdiv');
const ldivider = document.getElementById('ldiv');
const edivider = document.getElementById('ediv');
const pdivider = document.getElementById('pdiv');

// input id name
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phoneNumber = document.getElementById('phoneNumber');

firstName.addEventListener("input", (e) => {
    const firstNameValue = e.currentTarget.value; 
    if(/[A-Za-z]/.test(firstNameValue) == true) {
        fdivider.classList.add("valid");
    }
    else {
        fdivider.classList.remove("valid");
    }
})

lastName.addEventListener("input", (e) => {
    const lastNameValue = e.currentTarget.value; 
    if(/[A-Za-z]/.test(lastNameValue) == true) {
        ldivider.classList.add("valid");
    }
    else {
        ldivider.classList.remove("valid");
    }
})

email.addEventListener("input", (e) => {
    const emailValue = e.currentTarget.value; 
    if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]/.test(emailValue) == true) {
        edivider.classList.add("valid");
    }
    else {
        edivider.classList.remove("valid");
    }
})

phoneNumber.addEventListener("input", (e) => {
    const phoneNumberValue = e.currentTarget.value; 
    if(/[0-9]{10,12}/.test(phoneNumberValue) == true) {
        pdivider.classList.add("valid");
    }
    else {
        pdivider.classList.remove("valid");
    }
})