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

window.onload = function() {
    $("#dropoutsDataTable").DataTable({
        bLengthChange: false,
        pageLength: 5,
        dom:
        "<'row'<'col-sm-12'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    });
    $("#returneesDataTable").DataTable({
        bLengthChange: false,
        pageLength: 5,
        dom:
        "<'row'<'col-sm-12'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    });
}

function sortByStudentName(tableName) {
    const studentsDataTable = document.getElementById(tableName);
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