const dateNow = document.getElementById('dateNow');
const transactionsHeader = document.getElementById('transactions');
const total = document.getElementById('total');

const date_start = document.getElementById('date_start');
const date_end = document.getElementById('date_end');


async function getData(){
    console.log(date_start.value);
    console.log(date_end.value);
    const data = await GetApi();

    //จำนวนทั้งหมด
    const totalMeney = calculateTotalMeney(data);
    console.log(`รวมจำนวนเงินทั้งหมด: ${formatNumber(totalMeney)}`);
    total.textContent =`${formatNumber(totalMeney)} B`;

    //เงินแยกตามประเภท
    const result = calculateByWalletType(data); // Calculate totals and group by wallet types
    console.log(`รวมจำนวนเงินทั้งหมด: ${formatNumber(result.totalMeney)}`);
    Object.keys(result.walletTypes).forEach(walletType => {
        console.log(`${walletType}: ${formatNumber(result.walletTypes[walletType])}`);
    });

    // Display breakdown by wallet_type_text
    const walletBreakdownElement = document.getElementById('walletBreakdown');
    walletBreakdownElement.innerHTML= "";
    Object.keys(result.walletTypes).forEach(walletType => {
        const walletItem = document.createElement('h6');
        walletItem.textContent = `${walletType}: ${formatNumber(result.walletTypes[walletType])}`;
        total.appendChild(walletItem);
    });

    //List
    const sortedData = sortDataByDetailsTypeCode(data);
    const groupedData = groupDataByDetailsType(sortedData);
    console.log(groupedData);

    //Display List
    renderData(groupedData);

}

function groupDataByDetailsType(data) {
    const groupedData = {};

    data.forEach(item => {
        const type = item.details_type_text;

        if (!groupedData[type]) {
            groupedData[type] = {
                total: 0,
                items: []
            };
        }

        groupedData[type].total += item.meney;
        groupedData[type].items.push(item);
    });

    return groupedData;
}

async function GetApi() {
    try {
        const apiUrl = `https://script.google.com/macros/s/AKfycby3GC18UFJFucWCuVFBntzgv_9jbTzqcwmjroTPc38EhyWSmjgfPev5tdLoojoPDKWCjg/exec?action=getWallet&start_date=${date_start.value}&end_date=${date_end.value}`;
        console.log(apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function sortDataByDetailsTypeCode(data) {
    return data.sort((a, b) => a.details_type_code - b.details_type_code);
}

function renderData(groupedData) {
    const dataList = document.getElementById('dataList');

    dataList.innerHTML = ""; 
    Object.keys(groupedData).forEach(type => {
        const group = groupedData[type];
        const headerItem = document.createElement('li');
        headerItem.innerHTML = `<strong>${type} - รวม: ${formatNumber(group.total)}</strong>`;
        dataList.appendChild(headerItem);

        //Item details
        // group.items.forEach(item => {
        //     const listItem = document.createElement('li');
        //     listItem.className = 'd-flex align-items-center mb-6';
        //     listItem.innerHTML = `
        //         <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
        //             <div class="me-2">
        //                 <small class="d-block">${item.date_create} ${item.time_create}</small>
        //                 <h6 class="fw-normal mb-0">${item.details}</h6>
        //             </div>
        //             <div class="user-progress d-flex align-items-center gap-2">
        //                 <h6 class="fw-normal mb-0">${formatNumber(item.meney)}</h6>
        //                 <span class="text-muted">${item.wallet_type_text}</span>
        //             </div>
        //         </div>
        //     `;
        //     dataList.appendChild(listItem);
        // });
    });
}

// Helper function to format number
function formatNumber(number) {
    return new Intl.NumberFormat('th-TH').format(number);
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

function calculateByWalletType(data) {
    const result = {
        totalMeney: 0,
        walletTypes: {}
    };

    data.forEach(item => {
        // Add to totalMeney
        result.totalMeney += item.meney;

        // Group by wallet_type_text
        const walletType = item.wallet_type_text;
        if (!result.walletTypes[walletType]) {
            result.walletTypes[walletType] = 0;
        }
        result.walletTypes[walletType] += item.meney;
    });

    return result;
}


