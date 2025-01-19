let excelData = [];

document.addEventListener("DOMContentLoaded", function() {
    fetch("sample.xlsx")
        .then(response => response.blob())
        .then(blob => {
            let reader = new FileReader();
            reader.onload = function(e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, {type: 'array'});
                let sheet = workbook.Sheets[workbook.SheetNames[0]];
                excelData = XLSX.utils.sheet_to_json(sheet);
                displayData(); // Load data on details page
            };
            reader.readAsArrayBuffer(blob);
        })
        .catch(error => console.error("Error loading Excel file:", error));
});

document.getElementById('uploadExcel')?.addEventListener('change', handleFile);
document.getElementById('uploadExcelDetails')?.addEventListener('change', handleFile);

function handleFile(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(sheet);
        
        if (event.target.id === 'uploadExcelDetails') {
            displayData();
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function searchBook() {
    let query = document.getElementById('searchBox').value.toLowerCase();
    let results = excelData.filter(row => JSON.stringify(row).toLowerCase().includes(query));
    
    let table = document.getElementById('searchResults');
    table.innerHTML = generateTable(results);
}

function displayData() {
    let table = document.getElementById('bookTable');
    table.innerHTML = generateTable(excelData);
}

function generateTable(data) {
    if (!data.length) return "<tr><td>No records found</td></tr>";

    let headers = Object.keys(data[0]);
    let headerRow = `<tr>${headers.map(h => `<th onclick="sortTable('${h}')">${h} ▼</th>`).join('')}</tr>`;
    let rows = data.map(row => `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`).join('');

    return headerRow + rows;
}

function sortTable(column) {
    excelData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    displayData();
}

// function exportToCSV() {
//     let csvContent = "data:text/csv;charset=utf-8," 
//         + [Object.keys(excelData[0]).join(","), ...excelData.map(row => Object.values(row).join(","))].join("\n");

//     let encodedUri = encodeURI(csvContent);
//     let link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "library_data.csv");
//     document.body.appendChild(link);
//     link.click();
// }

function exportToCSV() {
    // Ensure data is sorted before exporting
    let sortedData = [...excelData]; // Create a copy of the data to avoid modifying the original
    sortedData.sort((a, b) => {
        // Sort based on the first column or any specific column you want
        // Adjust the sorting logic based on your needs
        let column = Object.keys(a)[0]; // Default to sorting by the first column
        return a[column] > b[column] ? 1 : -1;
    });

    // Convert sorted data to CSV format
    let csvContent = "data:text/csv;charset=utf-8," 
        + [Object.keys(sortedData[0]).join(","), ...sortedData.map(row => Object.values(row).join(","))].join("\n");

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sorted_library_data.csv");
    document.body.appendChild(link);
    link.click();
}


function exportToExcel() {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'LibraryData');
    XLSX.writeFile(wb, 'library_data.xlsx');
}

function checkPassword() {
    let password = document.getElementById('adminPassword').value;
    if (password === "admin123") { 
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        alert("Incorrect password!");
    }
}

setTimeout(() => {
    let logo = document.getElementById('library-logob');
    if (logo) {
        logo.style.display = 'none'; // Hides the logo after 3 seconds
    }
}, 5000);
