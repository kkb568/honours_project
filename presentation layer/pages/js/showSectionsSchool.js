function showSection(itemNumber) {
    var sections = document.getElementsByClassName("section");
    for (let i = 0; i < sections.length; i++) {
        if (i == itemNumber-1) {
            sections.item(i).className = "section selected";
        } else {
            sections.item(i).className = "section";
        }
    }

    document.querySelectorAll('.button').forEach(button => {
        button.className = "button";
        button.addEventListener('click', function() {
            button.className = "button active"
        });
    });
}

function sortByStudentName() {
    const studentsDataTable = document.getElementById('studentsDataTable');
    // Setting the switching action.
    var switching = true;
    var x, y, i = 0;
    var switchCount = 0;
    var dir = "asc"; // Set sorting direction to ascending order.
    var shouldSwitch = false;
    while (switching) {
        switching = false;
        const rows = studentsDataTable.rows;
        for (i = 1; i < rows.length -1; i++) {
            // Tell that the switching should not be done.
            shouldSwitch = false;
            // Get the two students names from two elements.
            x = rows[i].getElementsByTagName("td")[0];
            y = rows[i + 1].getElementsByTagName("td")[0];
            // Check if the two rows should switch places based on the sorting direction.
            if (dir == "asc") {
                if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            else if (dir == "desc") {
                if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        // If shouldSwitch is true, make the switch and mark the switching action.
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            // If shouldSwitch is false and dir is "asc", set dir to "desc" and run loop again.
            if (switchCount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

window.onload = function() {
    var table = $("#studentsDataTable").DataTable({
        bLengthChange: false,
        pageLength: 5,
        dom:
        "<'row'<'col-sm-12'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    });
    table.rows().every(function () {
        this.node().addEventListener('click', () => {
            document.getElementById('name').value = this.node().children[0].innerText;
            document.getElementById('studentName').value = this.node().children[0].innerText;
            document.getElementById('dateOfBirth').value = this.node().children[1].innerText;
            document.getElementById('startDate').value = this.node().children[2].innerText;
            document.getElementById('endDate').value = this.node().children[3].innerText;
            document.getElementById('parentName').value = this.node().children[4].innerText;
            document.getElementById('parentContact').value = this.node().children[5].innerText;
            document.getElementById('status').value = this.node().children[6].innerText;
        });
    });
}

var done = false;
// Function for changing the email address input from p tag to input tag.
function editEmail(school) {
    const email = document.getElementById("schoolEmail").children[0];
    const editEmailButtons = document.getElementById('emailButtons');
    if (!done) {
        done = true;
        email.outerHTML = `<form id="emailChangeForm" action="/changeEmail/${school}" method="post"><input type="email" name="email" value=${email.innerText}></form>`;
        editEmailButtons.style.display = "table";
    }
}

// Function for changing the email address input from input tag to p tag.
function closeEmailEdit() {
    const email = document.getElementById("schoolEmail").children[0].children[0];
    const editEmailButtons = document.getElementById('emailButtons');
    if (done) {
        done = false;
        email.outerHTML = `<p>${email.value}</p>`;
        editEmailButtons.style.display = "none";
    }
}