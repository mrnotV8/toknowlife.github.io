// Generate API URL with current date
var startDate = getCurrentDate();
var endDate = getCurrentDate();
const dateNow = document.getElementById('dateNow');
const transactionsHeader = document.getElementById('transactions');
const total = document.getElementById('total');

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    //const currentDate = getCurrentDate();
    //dateNow.textContent = currentDate;

    populateList();
});

// Get today's date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นที่ 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to get date 7 days ago in YYYY-MM-DD format
function getDate7DaysAgo() {
    const today = new Date();
    today.setDate(today.getDate() - 7); // ย้อนวันที่ไป 7 วัน
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นที่ 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Function to fetch data from API
async function fetchData() {
    try {
        const apiUrl = `https://script.google.com/macros/s/AKfycby3GC18UFJFucWCuVFBntzgv_9jbTzqcwmjroTPc38EhyWSmjgfPev5tdLoojoPDKWCjg/exec?action=getWallet&start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


// Function to populate data into HTML table
async function populateList() {
    const data = await fetchData();
    // Calculate total "meney"
    const totalMeney = calculateTotalMeney(data);

    // Display total "meney" in Transactions header
    //transactionsHeader.textContent = `Transactions  Total: ${formatNumber(totalMeney)} B`;
    total.textContent =`${formatNumber(totalMeney)} B`;

    const sortedData = sortDataByDateDescending(data); // เรียงข้อมูล
    const dataList = document.getElementById('dataList');

        // **Clear existing list items**
    dataList.innerHTML = ""; 

    sortedData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'd-flex align-items-center mb-6';
        listItem.innerHTML = `
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                    <small class="d-block">${item.details_type_text}  ${item.date_create} ${item.time_create}</small>
                    <h6 class="fw-normal mb-0">${item.details}</h6>
                </div>
                <div class="user-progress d-flex align-items-center gap-2">
                    <h6 class="fw-normal mb-0">${formatNumber(item.meney)}</h6>
                    <span class="text-muted">${item.wallet_type_text}</span>
                </div>
            </div>
        `;
        dataList.appendChild(listItem);
    });
}

// Function to sort data by date (descending)
function sortDataByDateDescending(data) {
    return data.sort((a, b) => {
        const dateA = new Date(a.date_create);
        const dateB = new Date(b.date_create);
        return dateB - dateA; // เรียงจากวันที่มากไปหาน้อย
    });
}

// Function to calculate the total "meney"
function calculateTotalMeney(data) {
    return data.reduce((total, item) => total + item.meney, 0);
}

// Function to format number as 1,000.00
function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}





function last7Day(){
    startDate = getDate7DaysAgo();
    populateList();
}