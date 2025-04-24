

// Generate API URL with current date
const startDate = getCurrentDate();
const endDate = getCurrentDate();
const transactionsHeader = document.getElementById('transactions');

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const currentDate = getCurrentDate();
    transactionsHeader.textContent = `Transactions ${currentDate}`;

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
    const dataList = document.getElementById('dataList');

    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'd-flex align-items-center mb-6';
        listItem.innerHTML = `
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                    <small class="d-block">${item.details_type_text}  ${item.time_create}</small>
                    <h6 class="fw-normal mb-0">${item.details}</h6>
                </div>
                <div class="user-progress d-flex align-items-center gap-2">
                    <h6 class="fw-normal mb-0">${item.meney}</h6>
                    <span class="text-muted">${item.wallet_type_text}</span>
                </div>
            </div>
        `;
        dataList.appendChild(listItem);
    });
}

