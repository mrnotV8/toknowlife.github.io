const form_data_id = document.getElementById("form_data_id");

// ตัวแปรเก็บค่าปัจจุบัน
let currentSelectedButton = null;

//Input
var wallet_type_code_id = document.getElementById("wallet_type_code_id");
var wallet_type_text_id = document.getElementById("wallet_type_text_id");

//Msg
const alert_msg_id = document.getElementById("alert_msg_id");

// จัดการการคลิกปุ่ม
document.querySelectorAll('.payment-buttons .btn').forEach(button => {
    button.addEventListener('click', function() {
      // เคลียร์สีปุ่มทั้งหมดก่อน
      ClearButtonStyles();
      
      // ตั้งค่าสีปุ่มที่เลือก
      this.classList.remove('btn-outline-primary');
      this.classList.add('btn-primary');
      currentSelectedButton = this;
      
      // เก็บค่า Value และ Text
      const value = this.getAttribute('data-value');
      const text = this.textContent.trim().replace(/\s[A-Za-z]$/, ''); // ลบตัวอักษร A/B/C ท้ายชื่อ
      
      // ใส่ค่าใน hidden inputs
      //document.getElementById('wallet_type_code_id').value = value;
      //document.getElementById('wallet_type_text_id').value = text;
      // wallet_type_code_id = value;
      // wallet_type_text_id = text;
      
      wallet_type_code_id.value = value;
      wallet_type_text_id.value = text;

      console.log('เลือก:', text, 'ค่า:', value);
    });
  });

// ฟังก์ชันเคลียร์สีปุ่มทั้งหมด
function ClearButtonStyles() {
    document.querySelectorAll('.payment-buttons .btn').forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-primary');
    });
  }


async function Confirm(){
    try {
   
      const result = await Swal.fire({
        title: 'ข้อความ',
        text: 'บันทึกกระเป๋าตัง ใช่ หรือ ยกเลิก ? ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
    });
   
    if (result.isConfirmed) {
        const sel_type_details = document.getElementById("details_type_code_id");
        document.getElementById("details_type_text_id").value = sel_type_details.options[sel_type_details.selectedIndex].text;

        var form_data = new FormData(form_data_id);
        const form_data_res = Object.fromEntries(form_data.entries());
        console.log(form_data_res);

        var resValueData = false;
        resValueData = await ValidateData(form_data_res);
        console.log(resValueData);
        if(resValueData == true){
          var resCallApi = false;
          resCallApi = CallApi(form_data_res);

          alert_msg_id.className ="";
          alert_msg_id.classList.add("alert", "alert-success");
          alert_msg_id.textContent= "Success "+ form_data_res.details;

          ClearForm();
        }
        else{

          alert_msg_id.className ="";
          alert_msg_id.classList.add("alert", "alert-danger");
          alert_msg_id.textContent= "Unsuccessful";

        }

    }

    }
    catch (error) {
      console.error('Something went wrong:', error);
      return false;
    }
}

async function ValidateData(data) {
  if (
    !data.details_type_code ||
    !data.details_type_text ||
    !data.meney ||
    !data.wallet_type_code ||
    !data.wallet_type_text
  ) {
    return false;
  }

  if (isNaN(data.meney)) {
    return false;
  }

  return true;
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


function ClearForm() {
  // Reset the form (this will clear all input fields)
  document.getElementById("form_data_id").reset();
  
  wallet_type_code_id.value = "";
  wallet_type_text_id.value ="";

   // เคลียร์สีปุ่มทั้งหมดก่อน
   ClearButtonStyles();
}


function ShareCodeFriToFb() {
    try {

        // ดึงค่าอย่างปลอดภัย
        const refcode = "AAAAA"
        const herodirect = "https://mrnotv8.github.io/toknowlife.github.io/";

        if (!refcode) {
            console.error('ref_code ว่างเปล่า');
            alert('เกิดข้อผิดพลาด: ไม่พบรหัสอ้างอิง');
            return;
        }

        if (!herodirect) {
            console.error('urlDynasty ว่างเปล่า');
            alert('เกิดข้อผิดพลาด: ไม่พบ URL');
            return;
        }

        // สร้าง URL ที่จะแชร์
        const shareUrl = `${herodirect}?url_ref_code=${refcode}&Clear=Clear`;

        // ข้อความสำหรับแชร์
        const shareTitle = "Dynasty Chronicles - Three Kingdoms Battle!";
        const shareDescription = "🔥 Wage war in the Three Kingdoms! Join the Dynasty Chronicles pre-registration and help me earn epic rewards! Tap the link and be my ally.";
        const userMessage = `${shareDescription}\n\n${shareUrl}\n\n#DynastyChronicles #ThreeKingdoms #Gaming`;

        // อัพเดต meta tags แบบ dynamic (ถ้าต้องการ)
        updateMetaTags(shareTitle, shareDescription, shareUrl);

        // Log เพื่อ debug
        console.log('Share URL:', shareUrl);
        console.log('Share Message:', userMessage);

        // สร้าง Facebook Share URL
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

        // เปิดหน้าต่างใหม่สำหรับแชร์
        const popup = window.open(facebookShareUrl, 'facebook-share-dialog', 'width=626,height=436,scrollbars=yes,resizable=yes');

        // Copy ข้อความไปยัง clipboard สำหรับให้ user paste เอง
        if (popup) {
            setTimeout(() => {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(userMessage).then(() => {
                        console.log('ข้อความถูก copy ไปยัง clipboard แล้ว');
                        alert('✅ ข้อความสำหรับแชร์ถูก copy ไปยัง clipboard แล้ว!\n\nคุณสามารถ Paste (Ctrl+V) ลงในโพสต์ Facebook ได้เลย!');
                    }).catch(err => {
                        console.log('ไม่สามารถ copy ข้อความได้:', err);
                        showMessagePrompt(userMessage);
                    });
                } else {
                    showMessagePrompt(userMessage);
                }
            }, 1000);
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแชร์:', error);
        alert('เกิดข้อผิดพลาดในการแชร์ Facebook');
    }
}

// Function เสริมสำหรับอัพเดต meta tags
function updateMetaTags(title, description, url) {
    // อัพเดต og:title
    let titleMeta = document.querySelector('meta[property="og:title"]');
    if (!titleMeta) {
        titleMeta = document.createElement('meta');
        titleMeta.setAttribute('property', 'og:title');
        document.head.appendChild(titleMeta);
    }
    titleMeta.setAttribute('content', title);

    // อัพเดต og:description
    let descMeta = document.querySelector('meta[property="og:description"]');
    if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('property', 'og:description');
        document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    // อัพเดต og:url
    let urlMeta = document.querySelector('meta[property="og:url"]');
    if (!urlMeta) {
        urlMeta = document.createElement('meta');
        urlMeta.setAttribute('property', 'og:url');
        document.head.appendChild(urlMeta);
    }
    urlMeta.setAttribute('content', url);
}

// Function เสริมสำหรับแสดง message prompt
function showMessagePrompt(message) {
    const textarea = document.createElement('textarea');
    textarea.value = message;
    textarea.style.position = 'fixed';
    textarea.style.top = '50%';
    textarea.style.left = '50%';
    textarea.style.transform = 'translate(-50%, -50%)';
    textarea.style.width = '400px';
    textarea.style.height = '200px';
    textarea.style.zIndex = '9999';
    textarea.style.padding = '10px';
    textarea.style.border = '2px solid #4267B2';
    textarea.style.borderRadius = '8px';
    textarea.select();

    document.body.appendChild(textarea);

    setTimeout(() => {
        document.body.removeChild(textarea);
    }, 10000);

    alert('กรุณา Copy ข้อความจาก text box ที่ปรากฏขึ้นมา แล้วนำไป Paste ใน Facebook!');
}


