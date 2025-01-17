const SECRET_KEY = "ZHM_Library123";

function encryptData(data) {
    return btoa(unescape(encodeURIComponent(data)));
}

function decryptData(data) {
    return decodeURIComponent(escape(atob(data)));
}

function saveEncryptedExcel() {
    let jsonString = JSON.stringify(excelData);
    let encryptedData = encryptData(jsonString);

    let blob = new Blob([encryptedData], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'library_data_encrypted.txt';
    link.click();
}
