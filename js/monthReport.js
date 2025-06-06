const dateNow = document.getElementById('dateNow');
const transactionsHeader = document.getElementById('transactions');
const total = document.getElementById('total');

const date_start = document.getElementById('date_start');
const date_end = document.getElementById('date_end');
var chart; // ตัวแปรเก็บ chart ด้านนอกฟังก์ชัน


document.addEventListener("DOMContentLoaded", function () {
    let today = new Date();
    
    // กำหนดวันที่เริ่มต้นเป็นวันที่ 1 ของเดือนปัจจุบัน
    let firstDay = new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split("T")[0];

    // กำหนดวันที่สิ้นสุดเป็นวันสุดท้ายของเดือนปัจจุบัน
    let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

    console.log("Start:"+firstDay);
    console.log("End:"+lastDay);

    date_start.value = firstDay;
    date_end.value = lastDay;
});



async function getData(){
    console.log(date_start.value);
    console.log(date_end.value);
    const data = await GetApi();
    //console.log(data);

    //จำนวนเงินทั้งหมด
    const totalMeney = calculateTotalMeney(data);
    total.textContent =`${formatNumber(totalMeney)} B`;

    //เงินแยกตามประเภท
    const resultWalletType = calculateByWalletType(data); 
    renderMyChart(resultWalletType);

    var resGroupWalletType = groupWalletType(data);
    console.log(resGroupWalletType);
    renderGroupWalletType(resGroupWalletType);

    //List Dt
    const sortedData = sortDataByDetailsTypeCode(data);
    const groupedData = groupDataByDetailsType(sortedData);
    console.log(groupedData);

    //Display List
    renderData(groupedData);

}


function renderMyChart(data) {
  if (chart) {
    chart.destroy(); // ล้างกราฟเก่า
  }

  var xValues = Object.keys(data.walletTypes);
  var yValues = Object.values(data.walletTypes);
  var barColors = ["red", "green", "blue"];

  chart = new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: 'black',
          font: {
            weight: 'bold'
          },
          formatter: function(value) {
            return value.toLocaleString() + " บาท";
          }
        }
      },
      title: {
        display: true,
       // text: "ยอดเงินรวม: " + data.totalMeney.toLocaleString() + " บาท"
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel.toLocaleString() + " บาท";
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              return value.toLocaleString() + " บาท";
            }
          }
        }]
      }
    },
    plugins: [ChartDataLabels]
  });
}

function groupWalletType(data) {
    const groupedData = {};

    data.forEach(item => {
        const type = item.wallet_type_text;

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

function renderGroupWalletType(groupedData) {

    const dataList = document.getElementById('groupWalletType');

    dataList.innerHTML = ""; 
    Object.keys(groupedData).forEach(type => {
        const group = groupedData[type];

        // สร้างแถวใหม่
        const row = document.createElement('tr');

        // สร้างเซลล์ข้อมูลสำหรับ Type (พร้อม Event Click)
        const typeCell = document.createElement('td');
        typeCell.textContent = type;
        typeCell.style.cursor = 'pointer'; // เพิ่มตัวชี้เมาส์
        typeCell.addEventListener('click', () => showExpenseDetails(type, group.items));

        // สร้างเซลล์ข้อมูลสำหรับ Total
        const totalCell = document.createElement('td');
        totalCell.textContent = formatNumber(group.total);

        // ใส่เซลล์ลงในแถว
        row.appendChild(typeCell);
        row.appendChild(totalCell);

        // ใส่แถวลงใน <tbody>
        dataList.appendChild(row);


    });
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

    Object.keys(groupedData).forEach(type => {
        const group = groupedData[type];

        // สร้างแถวใหม่
        const row = document.createElement('tr');

        // สร้างเซลล์ข้อมูลสำหรับ Type (พร้อม Event Click)
        const typeCell = document.createElement('td');
        typeCell.textContent = type;
        typeCell.style.cursor = 'pointer'; // เพิ่มตัวชี้เมาส์
        typeCell.addEventListener('click', () => showExpenseDetails(type, group.items));

        // สร้างเซลล์ข้อมูลสำหรับ Total
        const totalCell = document.createElement('td');
        totalCell.textContent = formatNumber(group.total);

        // ใส่เซลล์ลงในแถว
        row.appendChild(typeCell);
        row.appendChild(totalCell);

        // ใส่แถวลงใน <tbody>
        dataList.appendChild(row);


    });
}

// ฟังก์ชันสำหรับแสดง Modal
function showExpenseDetails(type, items) {
    // ตรวจสอบ modalDetails ว่ามีใน DOM หรือไม่
    const dataList = document.getElementById('modalDetails');
    if (!dataList) {
        console.error("ไม่พบ 'modalDetails' ใน DOM");
        return;
    }

    // ตรวจสอบว่า items เป็น array
    if (!Array.isArray(items)) {
        console.error("'items' ไม่ใช่ array");
        return;
    }

    // ล้างข้อมูลเดิมใน modalDetails
    dataList.innerHTML = "";

    // ตั้งค่าชื่อ Modal
    document.getElementById('expenseModalLabel').textContent = `รายละเอียด: ${type}`;
    
    // วนลูปเพื่อเพิ่มข้อมูลลงใน modalDetails
    items.forEach(item => {
        // ตรวจสอบว่า item มี key ที่ต้องการหรือไม่
        const {
            details_type_text = "ไม่ระบุประเภท",
            date_create = "ไม่ระบุวันที่",
            time_create = "ไม่ระบุเวลา",
            details = "ไม่มีรายละเอียด",
            meney = 0,
            wallet_type_text = "ไม่ระบุช่องทาง",
        } = item;

        const listItem = document.createElement('div');
        listItem.className = 'd-flex align-items-center mb-6';
        listItem.innerHTML = `
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                    <small class="d-block">${details_type_text} ${date_create} ${time_create}</small>
                    <h6 class="fw-normal mb-0">${details}</h6>
                </div>
                <div class="user-progress d-flex align-items-center gap-2">
                    <h6 class="fw-normal mb-0">${formatNumber(meney)}</h6>
                    <span class="text-muted">${wallet_type_text}</span>
                </div>
            </div>
        `;
        dataList.appendChild(listItem);
    });

    // แสดง Modal
    const expenseModal = new bootstrap.Modal(document.getElementById('expenseModal'));
    expenseModal.show();
}



function renderData_bk(groupedData) {
    const dataList = document.getElementById('dataList');

    dataList.innerHTML = ""; 
    Object.keys(groupedData).forEach(type => {
        const group = groupedData[type];
        const headerItem = document.createElement('li');
        headerItem.innerHTML = `<strong>${type} - รวม: ${formatNumber(group.total)}</strong>`;
        dataList.appendChild(headerItem);

        //Item details
        group.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'd-flex align-items-center mb-6';
            listItem.innerHTML = `
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <small class="d-block">${item.details_type_text} ${item.date_create} ${item.time_create}</small>
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


