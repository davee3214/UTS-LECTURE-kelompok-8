function logout() {
    localStorage.removeItem('username');
    window.location.reload();
    alert('kamu telah logout');
}
function login(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;

    if (username.trim() !== '') {
        alert('username telah diinput');
        localStorage.setItem('username', username);
        
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('greetings').textContent = 'Hello, ' + username;
    } else {
        alert('Please enter a username.');
    }
}

var dataMahasiswa = JSON.parse(localStorage.getItem('dataMahasiswa')) || [];
document.addEventListener("DOMContentLoaded", function () {
    var username = localStorage.getItem('username');
    if (username) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('greetings').textContent = 'Hello, ' + username;
    }
});
function resetFields() {
    var nimInput = document.getElementById('nim');
    var namaInput = document.getElementById('nama');
    var alamatInput = document.getElementById('alamat');

    nimInput.value = '';
    namaInput.value = '';
    alamatInput.value = '';

    nimInput.style.borderColor = '';
    namaInput.style.borderColor = '';
    alamatInput.style.borderColor = '';
    nimInput.style.color = '';
    namaInput.style.color = '';
    alamatInput.style.color = '';
}
function tambahData() {
    var nim = document.getElementById('nim').value;
    var nama = document.getElementById('nama').value;
    var alamat = document.getElementById('alamat').value;
    var nimInput = document.getElementById('nim');
    var namaInput = document.getElementById('nama');
    var alamatInput = document.getElementById('alamat');
    var isError = false;

    if (nim === 'INVALID' || nama === 'INVALID' || alamat === 'INVALID') {
        alert('Harap isi dengan benar sebelum menambahkan data.');
        return;
    }

    if (!/^\d+$/.test(nim)) {
        nimInput.value = '';
        nimInput.setAttribute('placeholder', 'INVALID');
        nimInput.style.color = 'red';
        isError = true;
    }

    if (!/^[a-zA-Z\s]*$/.test(nama)) {
        namaInput.value = '';
        namaInput.setAttribute('placeholder', 'INVALID');
        namaInput.style.color = 'yellow';
        isError = true;
    }

    if (!/^[a-zA-Z0-9\s]*$/.test(alamat)) {
        alamatInput.value = '';
        alamatInput.setAttribute('placeholder', 'INVALID');
        alamatInput.style.color = 'red';
        isError = true;
    }

    if (isError) {
        alert('Harap isi semua field dengan benar.');
        return;
    }

    if (nim && nama && alamat) {
        var mahasiswa = { nim: nim, nama: nama, alamat: alamat };
        dataMahasiswa.push(mahasiswa);
        localStorage.setItem('dataMahasiswa', JSON.stringify(dataMahasiswa));
        alert('Data berhasil ditambahkan!');
        currentPage = 1;
        tampilkanData();
    } else {
        alert('Harap lengkapi semua field.');
    }
}


var currentPage = 1;
var entriesPerPage = 1;
function generatePageButtons(totalPages) {
    var pageButtonsDiv = document.getElementById('page-buttons');
    pageButtonsDiv.innerHTML = '';

    var maxButtons = 5;
    var startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    var endPage = Math.min(totalPages, startPage + maxButtons - 1);

    for (var i = startPage; i <= endPage; i++) {
        var button = document.createElement('button');
        button.textContent = i;
        button.style = "margin-right: 5px";
        button.onclick = function () {
            currentPage = parseInt(this.textContent);
            tampilkanData();
        };
        pageButtonsDiv.appendChild(button);
    }
}
function tampilkanData() {
    var table = document.querySelector('#data-container');
    var totalPages = Math.ceil(totalEntries / entriesPerPage);
    table.innerHTML = '';
    var searchInput = document.getElementById('search-input').value.toLowerCase();
    var searchBy = document.getElementById('search-by').value;
    var filteredData = dataMahasiswa.filter(mahasiswa => {
        if (searchBy === 'nama') {
            return mahasiswa.nama.toLowerCase().includes(searchInput);
        } else if (searchBy === 'nim') {
            return mahasiswa.nim.toLowerCase().includes(searchInput);
        } else if (searchBy === 'alamat') {
            return mahasiswa.alamat.toLowerCase().includes(searchInput);
        }
    });
    var totalEntries = filteredData.length;
    var totalPages = Math.ceil(totalEntries / entriesPerPage);
    var startIndex = (currentPage - 1) * entriesPerPage;
    var endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    var displayedData = filteredData.slice(startIndex, endIndex);
    generatePageButtons(totalPages);
    var tableHTML = '<table><thead><tr><th>Nomor Induk Mahasiswa</th><th>Nama Lengkap</th><th>Alamat Tempat Tinggal Asal</th><th>PENGATURAN</th></tr></thead><tbody>';

    displayedData.forEach((mahasiswa, index) => {
        tableHTML += '<tr>';
        Object.values(mahasiswa).forEach(value => {
            tableHTML += '<td>' + value + '</td>';
        });
        tableHTML += '<td>';
        tableHTML += '<button onclick="unduhData(' + (startIndex + index) + ')" class="me-2">Unduh</button>';
        tableHTML += '<button onclick="editData(' + (startIndex + index) + ')" class="me-2">Edit</button>';
        tableHTML += '<button onclick="hapusData(' + (startIndex + index) + ')" class="me-2">Hapus</button>';
        tableHTML += '</td>';
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    table.innerHTML = tableHTML;

    document.getElementById('pagination-status').textContent = currentPage + ' out of ' + totalPages;

    var startIndexInfo = totalEntries > 0 ? startIndex + 1 : 0;
    var endIndexInfo = Math.min(startIndex + entriesPerPage, totalEntries);
    document.getElementById('pagination-info').textContent = startIndexInfo + '-' + endIndexInfo + ' out of ' + totalEntries + ' entries';
}



document.addEventListener("DOMContentLoaded", function () {
    var entriesSelect = document.getElementById('entries');

    entriesSelect.innerHTML = '';

    for (var i = 1; i <= 20; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        entriesSelect.appendChild(option);
    }

    entriesSelect.addEventListener('change', function () {
        entriesPerPage = parseInt(entriesSelect.value);
        currentPage = 1;
        tampilkanData();
    });

    tampilkanData();
});



var isEditing = false;
var selectedIndex;
var selectedIndex; 

function editData(index) {
    var mahasiswa = dataMahasiswa[index];
    document.getElementById('nim-edit').value = mahasiswa.nim;
    document.getElementById('nama-edit').value = mahasiswa.nama;
    document.getElementById('alamat-edit').value = mahasiswa.alamat;

    document.getElementById('alamat-edit').setAttribute('placeholder', '');

    document.getElementById('nim-edit').disabled = true;

    selectedIndex = index; 
    var editTableContainer = document.getElementById('edit-table-container');
    editTableContainer.style.display = 'block';
}

function simpanEdit() {
    
    var index = selectedIndex;
    var nama = document.getElementById('nama-edit').value;
    var alamat = document.getElementById('alamat-edit').value;

    if (!/^[a-zA-Z\s]*$/.test(nama)) {
        document.getElementById('nama-edit').value = '';
        document.getElementById('nama-edit').setAttribute('placeholder', 'INVALID');
        return; 
    }

    if (!/^[a-zA-Z0-9\s]*$/.test(alamat)) {
        document.getElementById('alamat-edit').value = '';
        document.getElementById('alamat-edit').setAttribute('placeholder', 'INVALID');
        return; 
    }

    var nim = dataMahasiswa[index].nim;

    dataMahasiswa[index] = { nim: nim, nama: nama, alamat: alamat };
    localStorage.setItem('dataMahasiswa', JSON.stringify(dataMahasiswa));
    alert('Data berhasil diperbarui!');
    tampilkanData();

    batalEdit();
    
}

function batalEdit() {
    var editTableContainer = document.getElementById('edit-table-container');
    editTableContainer.style.display = 'none'; 
}
function unduhData(index) {
    var mahasiswa = dataMahasiswa[index];
    var txtContent = "";

    txtContent += "Nomor Induk Mahasiswa: " + mahasiswa.nim + "\n";
    txtContent += "Nama Lengkap: " + mahasiswa.nama + "\n";
    txtContent += "Alamat Tempat Tinggal Asal: " + mahasiswa.alamat + "\n";

    var blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });

    var url = URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data_mahasiswa.txt");
    document.body.appendChild(link);
    link.click();
}

function hapusData(index) {
    var konfirmasi = confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (konfirmasi) {
        dataMahasiswa.splice(index, 1);
        localStorage.setItem('dataMahasiswa', JSON.stringify(dataMahasiswa));
        tampilkanData();
        alert('Data berhasil dihapus!');
    }
}

function updateTime() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = hours + ':' + minutes + ':' + seconds;
}
function sortData(selectedValue) {
    var order = selectedValue.split('_')[0];
    var type = selectedValue.split('_')[1];

    if (type === 'nama') {
        if (order === 'asc') {
            dataMahasiswa.sort((a, b) => (a.nama > b.nama) ? 1 : -1);
        } else if (order === 'desc') {
            dataMahasiswa.sort((a, b) => (a.nama < b.nama) ? 1 : -1);
        }
    } else if (type === 'nim') {
        if (order === 'asc') {
            dataMahasiswa.sort((a, b) => (a.nim > b.nim) ? 1 : -1);
        } else if (order === 'desc') {
            dataMahasiswa.sort((a, b) => (a.nim < b.nim) ? 1 : -1);
        }
    } else if (type === 'alamat') {
        if (order === 'asc') {
            dataMahasiswa.sort((a, b) => (a.alamat > b.alamat) ? 1 : -1);
        } else if (order === 'desc') {
            dataMahasiswa.sort((a, b) => (a.alamat < b.alamat) ? 1 : -1);
        }
    }

    tampilkanData();
}
setInterval(updateTime, 1000);
function searchData() {
    currentPage = 1;
    tampilkanData();
}

function playClickSound() {
    var sound = new Audio('mouseclick.mp3');
    sound.play();
}


document.querySelectorAll('.a').forEach(element => {
    element.addEventListener('click', playClickSound);
});

document.querySelectorAll('.button1, .button2, .button3, .button4, .button5, .button6, .button7, .button8').forEach(element => {
    element.addEventListener('click', playClickSound);
});

document.querySelectorAll('button').forEach(element => {
    element.addEventListener('click', playClickSound);
});
function firstPage() {
    currentPage = 1;
    tampilkanData();
}

function lastPage() {
    var searchInput = document.getElementById('search-input').value.toLowerCase();
    var searchBy = document.getElementById('search-by').value;
    var filteredData = dataMahasiswa.filter(mahasiswa => {
        if (searchBy === 'nama') {
            return mahasiswa.nama.toLowerCase().includes(searchInput);
        } else if (searchBy === 'nim') {
            return mahasiswa.nim.toLowerCase().includes(searchInput);
        } else if (searchBy === 'alamat') {
            return mahasiswa.alamat.toLowerCase().includes(searchInput);
        }
    });
    var totalEntries = filteredData.length;
    var totalPages = Math.ceil(totalEntries / entriesPerPage);

    currentPage = totalPages;
    tampilkanData();
}
function displayAlert() {
    var alert = document.getElementById("myAlert");
    alert.style.display = "block";
}

function closeAlert() {
    var alert = document.getElementById("myAlert");
    alert.style.opacity = "0";
    setTimeout(function(){ alert.style.display = "none"; }, 600);
}
