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


      const params = new URLSearchParams({
        action: 'getUsers',
      });

      const response = await fetch(`https://script.google.com/macros/s/AKfycby3GC18UFJFucWCuVFBntzgv_9jbTzqcwmjroTPc38EhyWSmjgfPev5tdLoojoPDKWCjg/exec?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('Response:', jsonResponse);
      return jsonResponse;
    }
    catch (error) {
      console.error('Something went wrong:', error);
      return false;
    }
}

