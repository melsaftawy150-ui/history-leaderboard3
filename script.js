// حط هنا رابط الـ Web App الجديد الخاص بك بعد النشر
const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let students = await response.json();

        // 1. فرز وترتيب الطلاب حسب الدرجة الأعلى
        students.sort((a, b) => b.score - a.score);

        // 2. تحديث لوحة الأوائل المميزة بالأسماء والدرجات
        if (students.length >= 1) {
            document.getElementById("firstName").textContent = students[0].name;
            document.getElementById("firstScore").textContent = students[0].score + " / 30";
        }
        if (students.length >= 2) {
            document.getElementById("secondName").textContent = students[1].name;
            document.getElementById("secondScore").textContent = students[1].score + " / 30";
        }
        if (students.length >= 3) {
            document.getElementById("thirdName").textContent = students[2].name;
            document.getElementById("thirdScore").textContent = students[2].score + " / 30";
        }

        // 3. بناء الجدول بالكامل
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        students.forEach((student, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td><span class="rank-badge">${index + 1}</span></td>
                    <td style="font-weight: 600;">${student.name}</td>
                    <td style="color: #ffd700; font-weight: bold;">${student.score} / 30</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// كود البحث الفوري الذكي
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// التشغيل التلقائي عند فتح الصفحة
loadData();
// تحديث تلقائي كل دقيقة لمزامنة الدرجات الجديدة
setInterval(loadData, 60000);
