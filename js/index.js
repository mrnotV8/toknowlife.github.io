const form_data_id = document.getElementById("form_data_id");

// ตัวแปรเก็บค่าปัจจุบัน
let currentSelectedButton = null;

var wallet_type_code_id = null;
var wallet_type_text_id = null;

// จัดการการคลิกปุ่ม
document.querySelectorAll('.payment-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
      // เคลียร์สีปุ่มทั้งหมดก่อน
      clearButtonStyles();
      
      // ตั้งค่าสีปุ่มที่เลือก
      this.classList.remove('btn-outline-primary');
      this.classList.add('btn-primary');
      currentSelectedButton = this;
      
      // เก็บค่า Value และ Text
      const value = this.getAttribute('data-value');
      const text = this.textContent.trim().replace(/\s[A-Za-z]$/, ''); // ลบตัวอักษร A/B/C ท้ายชื่อ
      
      // ใส่ค่าใน hidden inputs
      document.getElementById('wallet_type_code_id').value = value;
      document.getElementById('wallet_type_text_id').value = text;

      wallet_type_code_id = value;
      wallet_type_text_id = text;
      
      console.log('เลือก:', text, 'ค่า:', value);
    });
  });

// ฟังก์ชันเคลียร์สีปุ่มทั้งหมด
function clearButtonStyles() {
    document.querySelectorAll('.payment-buttons .btn').forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-primary');
    });
  }


async function Confirm(){
    try {
   
      const sel_type_details = document.getElementById("details_type_code_id");
      document.getElementById("details_type_text_id").value = sel_type_details.options[sel_type_details.selectedIndex].text;

      var form_data = new FormData(form_data_id);
      const form_data_res = Object.fromEntries(form_data.entries());
      console.log(form_data_res);

      // var data = {
      //   details_type_code: 5,
      //   details_type_text: "ค่าอาหาร",
      //   details: "ข้าวเช้า",
      //   meney: 60,
      //   wallet_type_code: "A",
      //   wallet_type_text: "เงินสด"
      // };

     var resCallApi = false;
     resCallApi = CallApi(form_data_res);
     clearForm();

    }
    catch (error) {
      console.error('Something went wrong:', error);
      return false;
    }
}

async function CallApi(data) {

  const url = 'https://script.google.com/macros/s/AKfycby3GC18UFJFucWCuVFBntzgv_9jbTzqcwmjroTPc38EhyWSmjgfPev5tdLoojoPDKWCjg/exec?action=setWallet';

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // ตั้งค่า mode เป็น no-cors
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // หมายเหตุ: ใน mode no-cors คุณจะไม่สามารถอ่าน response ได้
    console.log('Success:', response.data);
    return true ;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}


function clearForm() {
  // Reset the form (this will clear all input fields)
  document.getElementById("form_data_id").reset();
  
   // เคลียร์สีปุ่มทั้งหมดก่อน
   clearButtonStyles();
}

