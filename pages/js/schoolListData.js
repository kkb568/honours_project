document.addEventListener('DOMContentLoaded', () => {
    const schoolList = document.querySelector('#school');

    fetch('js/Kenyan high schools.json')
        .then((response) => response.json())
        .then((json) => {
            let output = '<option>Select school</option>';
            for (var i = 0; i < json.length; i++) {
                output += `<option value=${json[i].Name}>${json[i].Name}</option>`
            }
            schoolList.innerHTML = output;
        })
        .catch(error => console.log('error', error));
});