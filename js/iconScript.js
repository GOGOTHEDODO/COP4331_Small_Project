const divs = document.querySelectorAll('input');
const notification = document.getElementById('notificationBox');
const buttons = document.querySelectorAll('button');
const text = document.getElementById('text');

const patterns = {
    firstName: /^[A-Za-z]+$/,
    lastName: /^[A-Za-z]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneNumber: /^[0-9]{10,12}$/
};

const btns = {
    save: "Contact Updated!",
    delete: "Contact Deleted!",
    addContact: "Contact Added!"
}

divs.forEach(div => {
    div.addEventListener("input", (e) => {
        const tgt = e.currentTarget;
        const parent = tgt.parentNode;
        const inputId = tgt.id;

        if (patterns[inputId]) {
            if (patterns[inputId].test(tgt.value)) {
                parent.classList.add("valid");
            } else {
                parent.classList.remove("valid");
            }
        }
    });
});

// This is just a test to see how it would look
// TO-DO: link the buttons properly
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonID = e.currentTarget.id;
        if(btns[buttonID]) {
            notification.style.display = "block";
            text.innerHTML = btns[buttonID];
            setTimeout(() => {
              notification.style.display = "none";
            }, 3000); // Hide after 3 seconds
        }
    });
});