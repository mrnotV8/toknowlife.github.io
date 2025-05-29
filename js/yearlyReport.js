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

    // รับปีปัจจุบัน
    const currentYear = new Date().getFullYear();

    // วันที่เริ่มต้นของปีปัจจุบัน (1 มกราคม)
    const startOfYear = new Date(currentYear, 0, 1);

    // วันที่สุดท้ายของปีปัจจุบัน (31 ธันวาคม)
    const endOfYear = new Date(currentYear, 11, 31);

    // แสดงผลลัพธ์
    console.log("ปีปัจจุบัน:", currentYear);
    console.log("วันที่เริ่มต้นของปี:", startOfYear.toLocaleDateString('th-TH'));
    console.log("วันที่สุดท้ายของปี:", endOfYear.toLocaleDateString('th-TH'));

    // หรือแสดงในรูปแบบ ISO
    console.log("\nรูปแบบ ISO:");
    console.log("วันที่เริ่มต้นของปี:", startOfYear.toISOString().split('T')[0]);
    console.log("วันที่สุดท้ายของปี:", endOfYear.toISOString().split('T')[0]);

});



async function getData(){

    console.log(date_start.value);
    console.log(date_end.value);

    const data = await GetApi();
    console.log(data);


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


