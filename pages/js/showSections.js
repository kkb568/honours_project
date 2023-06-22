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