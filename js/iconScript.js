const divs = document.querySelectorAll('input');

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

function sortTableByColumn(table, columnIndex, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.rows);

    // Sort rows based on the specified column
    const sortedRows = rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim().toLowerCase();
        const cellB = rowB.cells[columnIndex].textContent.trim().toLowerCase();

        return (cellA > cellB ? 1 : -1) * dirModifier;
    });

    // Clear existing rows and append sorted rows
    tBody.innerHTML = '';  // Clear the table body
    tBody.append(...sortedRows);  // Append sorted rows

    // Update header styles
    const headers = table.querySelectorAll("th");
    headers.forEach(header => header.classList.remove("th-sort-asc", "th-sort-desc"));
    headers[columnIndex].classList.toggle("th-sort-asc", asc);
    headers[columnIndex].classList.toggle("th-sort-desc", !asc);
}

// Attach event listeners to sortable table headers
document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.closest("table");
        const headerIndex = Array.from(headerCell.parentNode.children).indexOf(headerCell);
        const isCurrentlyAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !isCurrentlyAscending);
    });
});