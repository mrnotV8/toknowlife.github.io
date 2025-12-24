let monthlyChart, categoryChart;
        const baseAPI = "https://script.google.com/macros/s/AKfycby3GC18UFJFucWCuVFBntzgv_9jbTzqcwmjroTPc38EhyWSmjgfPev5tdLoojoPDKWCjg/exec";

        async function fetchData() {
            const selectedYear = document.getElementById('yearSelect').value;
            document.querySelectorAll('.selected-year').forEach(el => el.innerText = selectedYear);
            
            const startDate = `${selectedYear}-01-01`;
            const endDate = `${selectedYear}-12-31`;
            const finalURL = `${baseAPI}?action=getWallet&start_date=${startDate}&end_date=${endDate}`;

            try {
                document.getElementById('total-year').innerText = "กำลังโหลด...";
                const response = await fetch(finalURL);
                const data = await response.json();
                processData(data);
            } catch (error) {
                console.error("Error:", error);
                alert("เกิดข้อผิดพลาดในการดึงข้อมูลปี " + selectedYear);
            }
        }

        function processData(data) {
            const months = Array(12).fill(0);
            const categories = {};
            let total = 0;
            let max = 0;

            if (!data || data.length === 0) {
                alert("ไม่มีข้อมูลในปีนี้");
                resetUI();
                return;
            }

            data.forEach(item => {
                const date = new Date(item.date_create);
                const monthIndex = date.getMonth();
                const amount = parseFloat(item.meney) || 0;

                if (amount > 0) {
                    months[monthIndex] += amount;
                    const catName = item.details_type_text || "อื่นๆ";
                    categories[catName] = (categories[catName] || 0) + amount;
                    total += amount;
                    if (amount > max) max = amount;
                }
            });

            updateUI(total, max);
            renderCharts(months, categories);
        }

        function resetUI() {
            updateUI(0, 0);
            renderCharts(Array(12).fill(0), {});
        }

        function updateUI(total, max) {
            document.getElementById('total-year').innerText = `฿${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            document.getElementById('avg-month').innerText = `฿${(total / 12).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            document.getElementById('max-expense').innerText = `฿${max.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }

        function renderCharts(monthData, categoryData) {
            const ctx1 = document.getElementById('monthlyChart').getContext('2d');
            const ctx2 = document.getElementById('categoryChart').getContext('2d');

            if (monthlyChart) monthlyChart.destroy();
            if (categoryChart) categoryChart.destroy();

            monthlyChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
                    datasets: [{
                        label: 'ยอดใช้จ่าย',
                        data: monthData,
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });

            categoryChart = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#2dd4bf']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        fetchData();