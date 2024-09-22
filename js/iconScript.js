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

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonID = e.currentTarget.id;
        if(buttonID == 'edit') {
            console.log("log out clicked")
            notification.style.display = "block";
            text.innerHTML = "Contact Updated!";
            setTimeout(() => {
              notification.style.display = "none";
            }, 3000); // Hide after 3 seconds
        }
        if(buttonID == 'delete') {
            console.log("log out clicked")
            notification.style.display = "block";
            text.innerHTML = "Contact Deleted!";
            setTimeout(() => {
              notification.style.display = "none";
            }, 3000); // Hide after 3 seconds
        }
        if(buttonID == 'addContact') {
            console.log("log out clicked")
            notification.style.display = "block";
            text.innerHTML = "Contact Added!";
            setTimeout(() => {
              notification.style.display = "none";
            }, 3000); // Hide after 3 seconds
        }
    });
});


// button.addEventListener("click", () => {
//     notification.style.display = "block";
//     text.innerHTML = "Contact Updated!";
//     setTimeout(() => {
//       notification.style.display = "none";
//     }, 3000); // Hide after 3 seconds
// })
