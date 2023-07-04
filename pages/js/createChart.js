function createDropoutByGenderChart(maleCount, femaleCount) {
    const chart = document.getElementById('dropoutsChart');
    new Chart(chart, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                label: 'Number of dropouts',
                data: [maleCount, femaleCount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)'
                ], 
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Dropouts by gender',
                    color: 'black',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

function createReturneesByGenderChart(maleCount, femaleCount) {
    const chart = document.getElementById('returneesChart');
    new Chart(chart, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                label: 'Number of returnees',
                data: [maleCount, femaleCount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)'
                ], 
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Returnees by gender',
                    color: 'black',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}