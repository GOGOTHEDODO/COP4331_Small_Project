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