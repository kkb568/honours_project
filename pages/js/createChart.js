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

function createDropoutByProvinceChart(data) {
    // Convert object to string.
    var record = JSON.stringify(data);
    // Separate the string into sub-strings using the comma as delimiter.
    var arr = record.split(",");
    // Remove the opening and closing quotes.
    arr[0] = arr[0].split('"')[1];
    arr[arr.length-1] = arr[arr.length-1].split('"')[0];
    var values = [], keys = [];
    // Separate the values and keys by checking if the arr index is divisible by 2.
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 != 0) {
            keys.push(arr[i]);
        } else {
            values.push(arr[i]);
        }
    }
    const chart = document.getElementById('dropoutsByProvinceChart');
    new Chart(chart, {
        type: 'bar',
        data: {
            labels: keys,
            datasets: [{
                label: 'Number of dropouts',
                data: values,
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
                    text: 'Dropouts by province',
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

function createReturneesByProvinceChart(data) {
    // Convert object to string.
    var record = JSON.stringify(data);
    // Separate the string into sub-strings using the comma as delimiter.
    var arr = record.split(",");
    // Remove the opening and closing quotes.
    arr[0] = arr[0].split('"')[1];
    arr[arr.length-1] = arr[arr.length-1].split('"')[0];
    var values = [], keys = [];
    // Separate the values and keys by checking if the arr index is divisible by 2.
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 != 0) {
            keys.push(arr[i]);
        } else {
            values.push(arr[i]);
        }
    }
    const chart = document.getElementById('returneesByProvinceChart');
    new Chart(chart, {
        type: 'bar',
        data: {
            labels: keys,
            datasets: [{
                label: 'Number of returnees',
                data: values,
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
                    text: 'Returnees by province',
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

function createDropoutsByAgeChart(data) {
    // Convert object to string.
    var record = JSON.stringify(data);
    // Separate the string into sub-strings using the comma as delimiter.
    var arr = record.split(",");
    // Remove the opening and closing quotes.
    arr[0] = arr[0].split('"')[1];
    arr[arr.length-1] = arr[arr.length-1].split('"')[0];
    var values = [], keys = [];
    // Separate the values and keys by checking if the arr index is divisible by 2.
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 != 0) {
            values.push(arr[i]);
        } else {
            keys.push(arr[i]);
        }
    }
    const chart = document.getElementById('dropoutsByAgeChart');
    new Chart(chart, {
        type: 'bar',
        data: {
            labels: keys,
            datasets: [{
                label: 'Number of dropouts',
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Age'
                    }
                },
                y: {
                    beginAtZero: true,
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Dropouts by age',
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