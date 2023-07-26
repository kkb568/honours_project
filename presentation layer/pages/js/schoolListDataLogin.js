document.addEventListener('DOMContentLoaded', () => {
    const schoolList = document.querySelector('#school');

    fetch('js/Kenyan high schools.json')
        .then((response) => response.json())
        .then((json) => {
            let output = '<option>Select school</option>';
            for (var i = 0; i < json.length; i++) {
                output += `<option value="${json[i].Name}">${json[i].Name}</option>`
            }
            schoolList.innerHTML = output;
        })
        .catch(error => console.log('error', error));
});

function togglePassword() {
    const password = document.getElementById("password");
    if (password.getAttribute("type") === "password") {
        password.setAttribute("type", "text");
        document.getElementById("eye").className = "fa fa-eye-slash";
    } else {
        password.setAttribute("type", "password");
        document.getElementById("eye").className = "fa fa-eye";
    }
}